const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db')

// Create a class for the category table that extends from Model library.
class Category extends Model {}

Category.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { sequelize, modelName: 'category' })

module.exports = Category