from django import forms

from autocomplete.models import AutoCompleteWidget

class AutoCompleteForm(forms.Form):
  names = forms.CharField(widget=AutoCompleteWidget(
    template='<img src="${img}" width="48" height="48" /> ${name}'))
