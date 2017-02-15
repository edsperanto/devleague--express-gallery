module.exports = function(sequelize, DataTypes) {
	var Photo = sequelize.define("Photo", {
		author: { 
			type: DataTypes.TEXT, 
			allowNull: false,
			validate: { 
				is: /[A-Z][A-z]+(?:\ [A-Z][A-z]+)*/
			}	
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
			validate: {
				is: /[A-Z][A-z]+(?:\ [A-Z][A-z]+)*/
			}	
		}
	});

	return Photo;
}
