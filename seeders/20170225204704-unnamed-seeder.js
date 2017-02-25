'use strict';

var photos = [
		{
			author: "Washington Coast",
			link: "https://i.redditmedia.com/NcMyFS3QBkbAGv0JkQA9RviZx_7v04GhENYItAg331M.jpg?w=1024&s=4631ae26b25833f075faeb16d618cc2c",
			description: "Ilwaco, WA",
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			author: "Konigssee Germany",
			link: "https://i.redditmedia.com/o6JJkGokh4Q40w3p2pXUWYtNbbN4ZCm4rJlptvh1bLI.jpg?w=1024&s=5f84a954f032410b9752e52b555f8272",
			description: "Germany",
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			author: "Glacier National Park",
			link: "https://i.redditmedia.com/PbPIz7806yh9WnIfzjLC2RILDtEbAoQQjpnlJzUpJjQ.jpg?w=1024&s=d9569945a2d48b836ff05c2590c09ac0",
			description: "from highline loop",
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			author: "Mono Lake",
			link: "https://i.redditmedia.com/nMjh3N5NU_a1SgrGwScdpWsgr_HNjtUsDDtVPci4GWc.jpg?w=1024&s=084409190b33a95e60dd97122508034b",
			description: "epic sunset",
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			author: "Smith Rock",
			link: "https://i.redditmedia.com/Cybr-Ui1MZjec5wGEsnZH1nKExxP4fiVdnfLzwO11Og.jpg?w=1024&s=31b6b8d79b4c69ffaa52ec46e67af1e7",
			description: "Oregon, USA",
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			author: "Alaskan Sunset",
			link: "https://i.redditmedia.com/S-KQsqBTUceXgAUx3fWRePlAkuP9kx6vLXJf-BGaiUQ.jpg?w=1024&s=95e614fcae3b245d127b1d3c32b2c68b",
			description: "Turnagain Arm, Alaska",
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			author: "Horseshoe Bend",
			link: "https://i.redditmedia.com/s1ke91ys_GJbyPJm0ahXQtoJbR8YFqfmKTohDxaqzYQ.jpg?w=1024&s=d240ea4619be895c652021712b0fcb31",
			description: "Arizona, USA",
			createdAt: new Date(),
			updatedAt: new Date()
		},
];

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Photos', photos);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Photos', photos);
  }
};
