document.addEventListener('DOMContentLoaded', function () {
	var downloadBtn = document.getElementById('downloadBtn');
	if (downloadBtn) {
		var original = downloadBtn.innerHTML;

		downloadBtn.addEventListener('click', function () {
			downloadBtn.classList.add('downloading');
			downloadBtn.innerHTML = 'Baixando! Confira seus downloads.';

			setTimeout(function () {
				downloadBtn.classList.remove('downloading');
				downloadBtn.innerHTML = original;
			}, 3000);
		});
	}

	loadAnalise();
});

function formatNumber(value) {
	if (value == null || isNaN(value)) return '...';
	return Number(value).toLocaleString('pt-BR');
}

function loadAnalise() {
	var stats = [
		{ id: 'statOnline', key: 'hypersclient_online_' + minuteKey() },
		{ id: 'statToday', key: 'hypersclient_daily_' + today() },
		{ id: 'statLaunches', key: 'hypersclient_launches' }
	];

	stats.forEach(function (item) {
		fetch('https://countapi.mileshilliard.com/api/v1/get/' + encodeURIComponent(item.key))
			.then(function (res) { return res.json(); })
			.then(function (data) {
				var el = document.getElementById(item.id);
				if (el) el.textContent = formatNumber(data.value);
			})
			.catch(function () {});
	});

	fetch('https://vnzinhypers-prog.github.io/badges.json')
		.then(function (res) { return res.json(); })
		.then(function (data) {
			var el = document.getElementById('statBadges');
			if (el) el.textContent = formatNumber(Object.keys(data || {}).length);
		})
		.catch(function () {});

	fetch('https://api.github.com/repos/vnzinhypers-prog/vnzinhypers-prog.github.io/releases/latest')
		.then(function (res) { return res.json(); })
		.then(function (data) {
			var total = 0;
			if (data && data.assets) {
				data.assets.forEach(function (asset) { total += asset.download_count; });
			}
			var el = document.getElementById('statDownloads');
			if (el) el.textContent = formatNumber(total);
		})
		.catch(function () {});
}

function today() {
	var d = new Date();
	var m = String(d.getUTCMonth() + 1).padStart(2, '0');
	var day = String(d.getUTCDate()).padStart(2, '0');
	return d.getUTCFullYear() + '-' + m + '-' + day;
}

function minuteKey() {
	var d = new Date();
	var m = String(d.getUTCMonth() + 1).padStart(2, '0');
	var day = String(d.getUTCDate()).padStart(2, '0');
	var h = String(d.getUTCHours()).padStart(2, '0');
	var min = String(d.getUTCMinutes()).padStart(2, '0');
	return d.getUTCFullYear() + m + day + h + min;
}
