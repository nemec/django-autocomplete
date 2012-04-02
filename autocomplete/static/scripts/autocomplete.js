/**
 * AutoComplete Field - JavaScript Code
 *
 * This is a sample source code provided by fromvega.
 * Search for the complete article at http://www.fromvega.com
 *
 * Modified by Dan Nemec (C) 2012
 *
 * Enjoy!
 *
 * @author fromvega
 * @author nemec
 *
 */

// global variables
var acDelay	= 500;
var acReg = {} ;

function defaultAutoCompleteCallback(key, item){
  acReg[key].search_field.val(item.name);
}

function tryDoCallback(key){
  var ac = acReg[key];
  if(ac.submit_callback){
    if(ac.list && 
        ac.list_ix >= 0 && ac.list_ix < ac.list.length){
      ac.submit_callback(key, ac.list[ac.list_ix]);
    }
    else{
      ac.submit_callback(key);
    }
  }
}

function setAutoCompleteCallback(field_id, callback){
  $(document).ready(function(){
    acReg[field_id].submit_callback = callback;
  });
}

function setAutoCompleteTemplate(field_id, template){
    $.template(field_id+'_acTemplate',
      '<div class="unselected">' + template + '</div>');
}

String.format = function() {
  var s = arguments[0];
  for (var i = 0; i < arguments.length - 1; i++) {       
    var reg = new RegExp("\\{" + i + "\\}", "gm");             
    s = s.replace(reg, arguments[i + 1]);
  }

  return s;
}

function setAutoComplete(field_id, results_id, get_url){
	// initialize vars
	var ac = {};
	acReg[field_id] = ac;
	
	ac.list = null;
	ac.list_ix = -1;
	ac.submit_callback = defaultAutoCompleteCallback;
	setAutoCompleteTemplate(field_id, '${}');

	ac.search_id = "#" + field_id;
	ac.results_id = "#" + results_id;
	ac.callback_url = get_url;

	// create the results div
	$("body").append('<div id="' + results_id + '"></div>');

	// register mostly used vars
	ac.search_field = $(ac.search_id);
	ac.results_div = $(ac.results_id);
	
	// on blur listener
	ac.search_field.blur(function(){
	  setTimeout('clearAutoComplete("' + field_id + '")', 200) });

	// on key up listener
	ac.search_field.keyup(function (e) {

		// get keyCode (window.event is for IE)
		var keyCode = e.keyCode || window.event.keyCode;
		var lastVal = ac.search_field.val();

		// check an treat up and down arrows
		if(updownArrow(field_id, keyCode)){
			return;
		}

		// check for an ENTER or ESC
		if(keyCode == 13 || keyCode == 27){
		  tryDoCallback(field_id);
			clearAutoComplete(field_id);
			return;
		}

		// if is text, call with delay
		setTimeout(function () {autoComplete(field_id, lastVal)}, acDelay);
	});
}

// treat the auto-complete action (delayed function)
function autoComplete(key, lastValue)
{
  var ac = acReg[key];
	// get the field value
	var query = ac.search_field.val();

	// if it's empty clear the resuts box and return
	if(query == ''){
		clearAutoComplete(key);
		return;
	}

	// if it's equal the value from the time of the call, allow
	if(lastValue != query){
		return;
	}

	// get remote data as JSON
	$.getJSON(ac.callback_url + query, function(json){

    clearAutoComplete(key);
    ac.list = json;
    ac.list_ix = -1;

		// if there are results populate the results div
		if(ac.list.length > 0){

			// create a div for each result
			for(i=0; i < ac.list.length; i++) {
			    var item = $.tmpl(key + '_acTemplate', ac.list[i])
			    item.appendTo(ac.results_id);
			}

    	// reposition div
    	repositionResultsDiv(key);
			ac.results_div.css("display","block");
			
			// for all divs in results
			var results = $(ac.results_id + " > div");
		
			// on mouse over clean previous selected and set a new one
			results.mouseover( function() {
				results.each(function(){
				  this.className = "unselected";
				});
				ac.list_ix = results.index(this);
				this.className = "selected";
			})
		
			// on click copy the result text to the search field and hide
			results.click( function() {
			  tryDoCallback(key);
				clearAutoComplete(key);
			});
		}
	});
}

// clear auto complete box
function clearAutoComplete(key)
{
	acReg[key].results_div.empty();
	acReg[key].results_div.css("display","none");
}

// reposition the results div accordingly to the search field
function repositionResultsDiv(key)
{
  var search_field = acReg[key].search_field;
	// get the field position
	var sf_pos    = search_field.offset();
	var sf_top    = sf_pos.top;
	var sf_left   = sf_pos.left;

	// get the field size
	var sf_height = search_field.height();
	var sf_width  = search_field.width();

	// apply the css styles - optimized for Firefox
	var results = acReg[key].results_div;
	results.css("position","absolute");
	results.css("left", sf_left - 2);
	results.css("top", sf_top + sf_height + 5);
	results.css("width", sf_width - 2);
}


// treat up and down key strokes defining the next selected element
function updownArrow(key, keyCode) {
  var ac = acReg[key];
	if(keyCode == 40 || keyCode == 38){
		if(keyCode == 38){ // keyUp
			if(ac.list_ix == 0 || ac.list_ix == -1){
				ac.list_ix = ac.list.length-1;
			}else{
				ac.list_ix--;
			}
		} else { // keyDown
			if(ac.list_ix == ac.list.length-1){
				ac.list_ix = 0;
			}else {
				ac.list_ix++;
			}
		}

		// loop through each result div applying the correct style
		ac.results_div.children().each(function(i){
			if(i == ac.list_ix){
				this.className = "selected";
			} else {
				this.className = "unselected";
			}
		});

		return true;
	} else {
		// reset
		//ac.list_ix = -1;
		return false;
	}
}
