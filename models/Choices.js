module.exports = function (sequelize, DataTypes) {
    const choices = sequelize.define('choices', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        questionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        choice: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    choices.associate = function (models) {
        // We're saying that a chioce should belong to a question
        // A choice can't be created without a question due to the foreign key constraint
        choices.belongsTo(models.questions, {
            foreignKey: {
                allowNull: false
            },
        });
    };

    return choices;

}