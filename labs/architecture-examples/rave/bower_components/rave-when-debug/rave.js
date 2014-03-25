module.exports = enableWhenMonitor;

function enableWhenMonitor(context) {
	if (context.debug || context.whenDebug) {
		require.async('when/monitor/console');
	}
	return {};
}
