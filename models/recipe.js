import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './user.js';


const Recipe = sequelize.define('Recipe', {
id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
name: { type: DataTypes.STRING, allowNull: false },
ingredients: { type: DataTypes.TEXT, allowNull: false },
instructions: { type: DataTypes.TEXT, allowNull: false },
category: { type: DataTypes.STRING, allowNull: false },
imageUrl: { type: DataTypes.STRING, allowNull: true }
});


User.hasMany(Recipe, { foreignKey: 'userId', onDelete: 'CASCADE' });
Recipe.belongsTo(User, { foreignKey: 'userId' });


export default Recipe;