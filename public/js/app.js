(function main() {

	// get elements
	const [title, bigCards, smallCards] = ['title', 'big-card', 'small-card']
		.map(card => document.getElementsByClassName(card));
	const [newBtn, editBtn, discardBtn, doneBtn, form] = ['new', 'edit', 'discard', 'done', 'form']
		.map(btn => document.getElementById(btn));

	// make cards link
	const redirTo = link => window.location.href = link;
	const repeat = (f, groups) => groups.forEach(group => f.apply(this, group));
	const link = (group, link) => Array.prototype.forEach.call(group, ele => {
		const dest = { 'home': '/', 'card': `/gallery/${ele.dataset.id}` };
		ele.addEventListener('click', _ => redirTo(dest[link]));
	});
	repeat(link, [[bigCards, 'card'], [smallCards, 'card'], [title, 'home']]);

	// button actions
	const create = _ => redirTo('/gallery/new');
	const edit = _ => redirTo(url+'/edit');
	const discard = _ => redirTo(url.match(/\/gallery\/[0-9A-z]+/g)[0]);
	const done = _ => form.submit();

	// control menu display
	const url = window.location.pathname;
	const onClick = (btn, cb) => btn.addEventListener('click', cb);
	const show = btns => btns.forEach(btn => btn.parentElement.style.display = 'initial');	
	const [itemRE, itemNewRE, itemEditRE] =
		[/^\/gallery\/[0-9]+$/g, /^\/gallery\/new$/g, /^\/gallery\/[0-9]+\/edit$/g];
	switch(true) {
		case itemNewRE.test(url): show([discardBtn, doneBtn]); break;
		case itemRE.test(url): show([newBtn, editBtn]); break;
		case itemEditRE.test(url): show([discardBtn, doneBtn]); break;
		default: show([newBtn]); break;
	}
	repeat(onClick, [[newBtn, create], [editBtn, edit], [discardBtn, discard], [doneBtn, done]]);

})();
