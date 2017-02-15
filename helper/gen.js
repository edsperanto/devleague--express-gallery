const gen = (function() {
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
	function allListing(photos) {
		return listify(photos)
			.then(tableList => {
				let bigCard = listRnd(tableList);
				let cardGroup = groupListIn3(tableList);
				return {bigCard, cardGroup};
			});
	}
	function details(item, table) {
		let i = 3;
		let details = item.get({plain: true});
		let tableList = listify(table)
			.filter(({id}) => id !== details.id);
		let sidePane = {smallCard: []};
		while(i--) sidePane.smallCard.push(listRnd(tableList));
		return {details, sidePane};
	}
	return { allListing, details };
})();

module.exports = gen;
