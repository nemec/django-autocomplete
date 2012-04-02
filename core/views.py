from django.shortcuts import render_to_response
from django.http import HttpResponseRedirect
from django.template import RequestContext


from core.forms import AutoCompleteForm


def index(req):
  if req.method == 'POST': # If the form has been submitted...
      form = AutoCompleteForm(req.POST) # A form bound to the POST data
      if form.is_valid(): # All validation rules pass
        # Process the data in form.cleaned_data
        # ...
        return HttpResponseRedirect('/thanks') # Redirect after POST
  else:
    form = AutoCompleteForm() # An unbound form

  return render_to_response('index.html', {
    'form': form,
  },
  context_instance=RequestContext(req))

def thanks(req):
  return render_to_response('thanks.html')
