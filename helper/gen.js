const gen = (function() {
	let pendingURI = '/';
	let pendingUser = '';
	let currUser = 'anonymous';
	function listify(table) {
		return table.findAll()
			.then(table => {
				return table.reduceRight((prev, curr) => {
					prev.push(curr.get({plain: true}));
					return prev;
				}, []);
			});
	}
	function listRnd(list) {
		let len = list.length;
		let rnd = Math.floor(Math.random() * len);
		if(len === 0) return false;
		return list.splice(rnd, 1)[0];
	}
	function groupListIn3(list) {
		return list.reduce((prev, curr) => {
			let last = prev.length - 1;
			if(prev[last].smallCard.length < 3)
				prev[last].smallCard.push(curr);
			else
				prev.push({smallCard: [curr]});
			return prev;
		}, [{smallCard: []}]);
	}
	function allListing(table) {
		return listify(table)
			.then(tableList => {
				let bigCard = listRnd(tableList);
				let cardGroup = groupListIn3(tableList);
				return {bigCard, cardGroup};
			});
	}
	function details(itemId, table) {
		let item = table.findOne({where: {id: itemId}})
			.then(item => item.get({plain: true}));
		let list = listify(table);
		return Promise.all([item, list])
			.then(([details, tableList]) => {
				let i = 3, sidePane = {smallCard: []};
				tableList = tableList.filter(({id}) => id !== details.id);
				while(i--) sidePane.smallCard.push(listRnd(tableList));
				return {details, sidePane};
			});
	}
	function newUser(username) {
		pendingUser = username;
	}
	function confUser() {
		currUser = pendingUser;
	}
	function user() {
		return currUser;
	}
	function lastURI(URI) {
		let blackList = ['/login', '/success', '/redirTo', '/css/app.css', '/js/app.js'];
		if(blackList.every(entry => URI !== entry)) pendingURI = URI;
	}
	function URI() {
		return pendingURI;
	}
	return { allListing, details, newUser, confUser, user, lastURI, URI };
})();

module.exports = gen;
