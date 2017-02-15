const gen = (function() {
	function listify(photos) {
		return photos.reduceRight((prev, curr) => {
			prev.push(curr.get({plain: true}));
			return prev;
		}, []);
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
		let photosList = listify(photos);
		let bigCard = listRnd(photosList);
		let cardGroup = groupListIn3(photosList);
		return {bigCard, cardGroup};
	}
	function details(photo, photos) {
		let i = 3;
		let details = photo.get({plain: true});
		let photosList = listify(photos)
			.filter(({id}) => id !== details.id);
		let sidePane = {smallCard: []};
		while(i--) sidePane.smallCard.push(listRnd(photosList));
		return {details, sidePane};
	}
	return { allListing, details };
})();

module.exports = gen;
