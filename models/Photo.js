module.exports = function(sequelize, DataTypes) {
	var Photo = sequelize.define("Photo", {
		author: DataTypes.STRING(30),
		link: DataTypes.STRING(50),
		description: DataTypes.TEXT
	});

	return Photo;
}
