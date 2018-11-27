module.exports = function (sequelize, DataTypes) {
    return sequelize.define('category', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image_name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

}