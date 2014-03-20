/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */
var findRequires = require('../lib/findRequires');
var nodeFactory = require('../lib/nodeFactory');
var addSourceUrl = require('../lib/addSourceUrl');

module.exports = instantiateNode;

function instantiateNode (load) {
	var loader, deps, factory;

	loader = load.metadata.rave.loader;
	deps = findRequires(load.source);

	// if debugging, add sourceURL
	if (load.metadata.rave.debug) {
		load.source = addSourceUrl(load.address, load.source);
	}

	factory = nodeFactory(loader, load);

	return {
		deps: deps,
		execute: function () {
			return new Module(factory.apply(this, arguments));
		}
	};
}
