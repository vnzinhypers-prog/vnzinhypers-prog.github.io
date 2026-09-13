document.addEventListener('DOMContentLoaded', function () {
	var downloadBtn = document.getElementById('downloadBtn');
	if (!downloadBtn) return;

	var original = downloadBtn.innerHTML;

	downloadBtn.addEventListener('click', function () {
		downloadBtn.classList.add('downloading');
		downloadBtn.innerHTML = 'Baixando! Confira seus downloads.';

		setTimeout(function () {
			downloadBtn.classList.remove('downloading');
			downloadBtn.innerHTML = original;
		}, 3000);
	});
});
