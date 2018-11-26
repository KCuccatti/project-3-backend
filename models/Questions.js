module.exports = function (sequelize, DataTypes) {
    const questions = sequelize.define('questions', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        question_text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        answer: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    questions.associate = function (models) {
        // Associating questions with choices
        // When a question is deleted, also delete any associated choices
        questions.hasMany(models.choices, {
            onDelete: 'cascade'
        });
    };

   return questions;

}