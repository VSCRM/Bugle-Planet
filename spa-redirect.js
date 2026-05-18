(function (l) {
	if (l.search[1] === '/') {
		var decoded = l.search
			.slice(1)
			.split('&')
			.map(function (string) { return string.replace(/~and~/g, '&'); })
			.join('?');
		window.history.replaceState(
			null,
			null,
			l.pathname.slice(0, l.pathname.length - 1) + decoded + l.hash,
		);
	}
})(window.location);
