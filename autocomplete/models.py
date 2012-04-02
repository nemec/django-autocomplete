from django.forms.widgets import Media, TextInput


class AutoCompleteWidget(TextInput):
  item_template = """
    <script type="text/javascript">
      $(function(){{
        setAutoCompleteTemplate('{0}', '{1}');
      }});
    </script>
  """
  bind_template = """
    <script type="text/javascript">
	    $(function(){{
	        setAutoComplete("{name}", "{results_div}",
            "{callback}?query=", "{autoselect}");
	    }});
    </script>
  """

  def _media(self):
    return Media(css={'all': (self.media_style,)},
                       js=('scripts/jquery.tmpl.min.js',
                            self.media_script))
  media=property(_media)

  def __init__(self, attrs=None, autoselect_first=False,
      callback_url="/autocomplete", results_div="results",
      style="style/autocomplete.css", script="scripts/autocomplete.js",
      template=None):
    super(AutoCompleteWidget, self).__init__(attrs)

    self.media_style = style
    self.media_script = script

    self.autoselect = autoselect_first
    self.callback_url = callback_url
    self.results_div = results_div
    if template:
      self.template = template.replace('\n', '')
    else:
      self.template = None

  def render(self, name, value, attrs=None):
    attrs['autocomplete'] = 'off'
    markup = []
    markup.append(self.bind_template.format(name=attrs['id'],
        callback=self.callback_url, results_div=self.results_div,
        autoselect=self.autoselect))
    markup.append(super(AutoCompleteWidget, self).render(name, value, attrs))
    if self.template:
      markup.append(self.item_template.format(attrs['id'], self.template))
    return ''.join(markup)
