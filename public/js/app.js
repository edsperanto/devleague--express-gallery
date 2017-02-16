(function main() {

	// get elements
	const getClass = name => document.getElementsByClassName(name);
	const getId = name => document.getElementById(name);
	const title = getClass('title');
	const newBtn = getId('new');
	const editBtn = getId('edit');
	const discardBtn = getId('discard');
	const doneBtn = getId('done');
	const bigCards = getClass('big-card');
	const smallCards = getClass('small-card');

	// make cards link
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

	// control menu display
	const url = window.location.pathname;
	const onClick = (btn, cb) => btn.addEventListener('click', cb);
	const show = btns => btns.forEach(btn => btn.style.display = 'initial');
	const itemNewRE = new RegExp("^/gallery/new$", "g");
	const itemRE = new RegExp("^\/gallery/[0-9]+$", "g");
	const itemEditRE = new RegExp("^\/gallery/[0-9]+/edit$", "g");
	switch(true) {
		case itemNewRE.test(url):
			show([discardBtn, doneBtn]);
			onClick(discardBtn, discard);
			onClick(doneBtn, done);
			break;
		case itemRE.test(url):
			show([newBtn, editBtn]);
			onClick(newBtn, create);
			onClick(editBtn, edit);
			break;
		case itemEditRE.test(url):
			show([discardBtn, doneBtn]);
			onClick(discardBtn, discard);
			onClick(doneBtn, done);
			break;
		default:
			show([newBtn]);
			onClick(newBtn, create);
			break;
	}

	// button actions
	function create() {

	}
	function edit() {

	}
	function discard() {

	}
	function done() {

	}
})();
