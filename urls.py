from django.conf.urls.defaults import patterns, include, url
from django.conf import settings

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

import autocomplete
print autocomplete.__file__

urlpatterns = patterns(settings.PROJECT_NAME + '.core.views',
  url(r'^$', 'index', name='index'),
  url(r'^thanks$', 'thanks', name='thanks'),
)

urlpatterns += patterns('',
  (r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT, 'show_indexes':True}),
  (r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT, 'show_indexes':True}),
  (r'^admin/', include(admin.site.urls)),
  url(r'^', include(autocomplete.urls)),
)
