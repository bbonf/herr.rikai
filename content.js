/* jshint multistr:true */
/* jshint undef:true */
/* global document, window, XMLHttpRequest */
/* global chrome */

var HerrRikai = (function() {
	var _dictionary = {};
	var _ready = false;
	var POPUP_NAME = 'herr_rikai_popup';

	var init_style = function() {
		var style = document.createElement('style');
		style.innerHTML = '#'+POPUP_NAME+' { \
			background: #333; \
			color:white; \
			position: absolute; \
			height: 150px; \
			width: 300px; \
			padding:10px; \
			opacity: 0; \
			z-index: 100; \
			font-size:12px; \
			transition: opacity 0.3s ease-out; \
		}';

		document.getElementsByTagName('head')[0].appendChild(style);
	};

	var load_dictionary = function() {
		var req = new XMLHttpRequest();
		req.open("GET", chrome.extension.getURL('dict.json'), false);
		req.send(null);
		_dictionary = JSON.parse(req.responseText);
	};

	var popup = function(txt, x, y) {
		var el = document.getElementById(POPUP_NAME);

		el.innerHTML = txt;
		el.style.top = y+'px';
		el.style.left = x+'px';
		el.style.opacity = 1;
	};

	var hide = function() {
		document.getElementById(POPUP_NAME).style.opacity = 0;	
		document.getElementById(POPUP_NAME).style.top = '-1000px';
	};

	var clean = function(word) {
		return word.replace('.','').replace(',','').replace(' ','');
	};

	var lookup = function(word) {
		if(!word) return;
		return _dictionary[word];
	};

	var mousemove = function(e) {
		var range = null;
		var textNode = null;
		var offset = null;

		if (document.caretPositionFromPoint) {
			range = document.caretPositionFromPoint(e.clientX, e.clientY);
			textNode = range.offsetNode;
			offset = range.offset;
		} else if (document.caretRangeFromPoint) {
			range = document.caretRangeFromPoint(e.clientX, e.clientY);
			textNode = range.startContainer;
			offset = range.startOffset;
		}

		var str = textNode.textContent;
		var start = offset;
		var end = offset;

		var delimiters = ' ,.\n":;-/\\!?';
		while(start >= 0 && delimiters.indexOf(str[start]) < 0) {
			start--;
		}
		start++;

		while(end <= str.length && delimiters.indexOf(str[end]) < 0) {
			end++;
		}

		var word = str.substring(start, end).toLowerCase();
		var trans = lookup(clean(word));
		var selection = window.getSelection();

		if(typeof(trans) != 'undefined') {
			popup(word+'<br/>'+trans, e.clientX, e.pageY + 20);
			
			range.setStart(textNode, start);
			range.setEnd(textNode, end);
			selection.removeAllRanges();
			selection.addRange(range);
		}
		else {
			hide();
			selection.removeAllRanges();
		}
	};

	var init = function() {
		if(_ready) {
			return;
		}

		init_style();
		load_dictionary();

		var popup = document.createElement('div');
		popup.id = 'herr_rikai_popup';
		document.body.appendChild(popup);

		document.addEventListener('mousemove',mousemove);
		_ready = true;
	};

	return {
		messageHandler: function(message, sender) {
			if(message.action == 'load') {
				init();
			}
		}
	};
})();

chrome.runtime.onMessage.addListener(HerrRikai.messageHandler);