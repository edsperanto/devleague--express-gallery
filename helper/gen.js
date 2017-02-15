const gen = (function() {
	function listify(photos) {
		return photos.reduce((prev, curr) => {
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
			if(prev[last].smallCard.length < 3) {
				prev[last].smallCard.push(listRnd(list));
			}else{
				prev.push({smallCard: [listRnd(list)]});
			}
			return prev;
		}, [{smallCard: []}]);
	}
	function _allListing(photos) {
		let photosList = listify(photos);
		let bigCard = listRnd(photosList);
		let cardGroup = groupListIn3(photosList);
		console.log(cardGroup);
		return {bigCard, cardGroup};
	}
	return {
		allListing: _allListing
	}
})();

module.exports = gen;
