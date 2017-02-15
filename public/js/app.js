(function main() {
	const title = [document.getElementById('title')];
	const bigCards = document.getElementsByClassName('big-card');
	const smallCards = document.getElementsByClassName('small-card');
	const redirTo = link => window.location.href = link;
	const link = (group, link) => Array.prototype.forEach.call(group, ele => {
		const dest = {
			'home': '/',
			'card': `/gallery/${ele.dataset.id}`
		}
		ele.addEventListener('click', _ => redirTo(dest[link]));
	});
	link(bigCards, 'card');
	link(smallCards, 'card');
	link(title, 'home');
})();
