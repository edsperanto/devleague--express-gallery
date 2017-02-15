const gen = (function() {
	function _allListing(photos) {
		return {
			bigCard: {},
			cardGroup: [
				{
					smallCard: [
						{},
						{},
						{}
					]
				},
				{},
				{}
			]
		}
	}
	return {
		allListing: _allListing
	}
})();

module.exports = gen;
