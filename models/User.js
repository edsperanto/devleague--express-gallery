module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define("User", {
		username: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				is: /[0-9A-z]+/g
			}
		},
		password: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	});

	return User;
}
