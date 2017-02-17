module.exports = function(sequelize, DataTypes) {
	var Photo = sequelize.define("Photo", {
		author: { 
			type: DataTypes.TEXT, 
			allowNull: false,
		},
		link: { 
			type: DataTypes.TEXT, 
			allowNull: false, 
			validate: {
				isUrl: true	
			}
		},
		description: { 
			type: DataTypes.TEXT, 
			allowNull: false,
		}
	});

	return Photo;
}
