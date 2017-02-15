console.log('sanity check');
(function() {
	const title = document.getElementsByClassName('title');
	const bigCards = document.getElementsByClassName('big-card');
	const smallCards = document.getElementsByClassName('small-card');
	const linkTo = link => window.location.href = link;
	const link = (group, link) => Array.prototype.forEach
		.call(group, ele => {
			ele.addEventListener('click', _ => {
				switch(link) {
					case 'card': linkTo(`/gallery/${ele.dataset.id}`);
						break;
					case 'home': window.location.href = '/';
						break;
				}
			});
		});
	link(bigCards, 'card');
	link(smallCards, 'card');
	link(title, 'home');
})();
