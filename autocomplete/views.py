from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.template import RequestContext
from django.conf import settings
from django.shortcuts import render_to_response, get_object_or_404
from django.core.urlresolvers import reverse

import urllib2
import urllib
import json
import yaml


google_autocomplete_url = "https://plus.google.com/complete/search?ds=es_profiles&client=es-profiles&partnerid=es-profiles&q={0}"

def process_google_response(response):
  """
    Convert the strange YAML response from the autocomplete
    query into a dictionary containing the information to
    display in autocomplete.
    
    Autocomplete keys are name (user's name), img (link to profile image),
      and id (user's id)

  """
  # Strip off the js function, add spaces after : to make valid yaml, and
  # remove all escaped slashes
  response = response.strip()[len("window.google.ac.h("):-1]
  response = response.replace(':', ': ').replace('\\/', '/')
  ret = yaml.load(response)[1]
    
  def form_dict(person):
    info = person[3][0]

    if person[1] == 44:
      typ = 'person'
      name = person[0]
    elif person[1] == 45:
      typ = 'page'
      name = info['n']
    else:
      typ = 'unknown: {0}'.format(person[1])
      name = person[0]
    # name[0] = Visible Name
    # name[1] = Profile type? (44=person, 45=page)
    # info['p'] = profile image
    # info['r'] = university major?
    # info['o'] = occupation
    # info['g'] = user id
    # info['i'] = user id with dashes?
    # info['es'] = always 1?
    # info['n'] = Page's Name
    return {
      'name': name,
      'img': info.get('p'),
      'id': info.get('g'),
      'type': typ
    }
  return [form_dict(result) for result in ret]
  

def autocomplete(req):
  ret = []
  if 'query' in req.GET:
    query = req.GET['query']
    try:
      g_req = urllib2.urlopen(
        google_autocomplete_url.format(urllib.quote_plus(query)), None)
      response = unicode(g_req.read(), 'latin-1')
      ret = process_google_response(response)
    except urllib2.HTTPError as err:
      print err
    except Exception as err:
      import traceback
      traceback.print_exc()
  return HttpResponse(json.dumps(ret), mimetype='application/json')

