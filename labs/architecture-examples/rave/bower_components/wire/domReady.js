/** @license MIT License (c) copyright 2011-2013 original author or authors */

/**
 * wire/domReady
 * A base wire/domReady module that plugins can use if they need domReady.  Simply
 * add 'wire/domReady' to your plugin module dependencies
 * (e.g. require(['wire/domReady', ...], function(domReady, ...) { ... })) and you're
 * set.
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Returns a function that accepts a callback to be called when the DOM is ready.
 *
 * You can also use your AMD loader's paths config to map wire/domReady to whatever
 * domReady function you might want to use.  See documentation for your AMD loader
 * for specific instructions.  For curl.js and requirejs, it will be something like:
 *
 *  paths: {
 *      'wire/domReady': 'path/to/my/domReady'
 *  }
 *
 * @author Brian Cavalier
 * @author John Hann
 */

(function(global, doc) {
define(function() {

	var readyState = 'readyState';
	var readyStates = { 'loaded': 1, 'interactive': 1, 'complete': 1 };
	var callbacks = [];
	var fixReadyState = doc && typeof doc[readyState] != "string";
	var completed = false;
	var pollerTime = 10;
	var addEvent;
	var remover;
	var removers = [];
	var pollerHandle;

	function domReady (cb) {
		if (completed) cb(); else callbacks.push(cb);
	}

	function ready () {
		completed = true;
		clearTimeout(pollerHandle);
		while (remover = removers.pop()) remover();
		if (fixReadyState) {
			doc[readyState] = "complete";
		}
		// callback all queued callbacks
		var cb;
		while ((cb = callbacks.shift())) {
			cb();
		}
	}

	var testEl;
	function isDomManipulable () {
		// question: implement Diego Perini's IEContentLoaded instead?
		// answer: The current impl seems more future-proof rather than a
		// non-standard method (doScroll). i don't care if the rest of the js
		// world is using doScroll! They can have fun repairing their libs when
		// the IE team removes doScroll in IE 13. :)
		if (!doc.body) return false; // no body? we're definitely not ready!
		if (!testEl) testEl = doc.createTextNode('');
		try {
			// webkit needs to use body. doc
			doc.body.removeChild(doc.body.appendChild(testEl));
			testEl = void 0;
			return true;
		}
		catch (ex) {
			return false;
		}
	}

	function checkDOMReady () {
		var isReady;
		// all browsers except IE will be ready when readyState == 'interactive'
		// so we also must check for document.body
		isReady = readyStates[doc[readyState]] && isDomManipulable();
		if (!completed && isReady) {
			ready();
		}
		return isReady;
	}

	function poller () {
		checkDOMReady();
		if (!completed) {
			pollerHandle = setTimeout(poller, pollerTime);
		}
	}

	// select the correct event listener function. all of our supported
	// browsers will use one of these
	if ('addEventListener' in global) {
		addEvent = function (node, event) {
			node.addEventListener(event, checkDOMReady, false);
			return function () { node.removeEventListener(event, checkDOMReady, false); };
		};
	}
	else {
		addEvent = function (node, event) {
			node.attachEvent('on' + event, checkDOMReady);
			return function () { node.detachEvent(event, checkDOMReady); };
		};
	}

	if (doc) {
		if (!checkDOMReady()) {
			// add event listeners and collect remover functions
			removers = [
				addEvent(global, 'load'),
				addEvent(doc, 'readystatechange'),
				addEvent(global, 'DOMContentLoaded')
			];
			// additionally, poll for readystate
			pollerHandle = setTimeout(poller, pollerTime);
		}
	}

	return domReady;
});
})(this, document);
