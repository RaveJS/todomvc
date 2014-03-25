module.exports = enableWhenMonitor;

var stackFilter = /when\.js|(module|node)\.js:\d|when\/monitor\/|(bower_components|node_modules)\/rave\//i;

function enableWhenMonitor(context) {
	if (context.debug || context.whenDebug) {
		return require.async('when/monitor/console').then(function() {
			if(typeof console !== 'undefined' && !console.promiseStackFilter) {
				console.promiseStackFilter = stackFilter;
			}
			return {};
		});
	}
	return Promise.resolve({});
}
