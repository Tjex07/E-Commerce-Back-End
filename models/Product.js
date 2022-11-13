// import important parts of sequelize library
const { Model, DataTypes } = require('sequelize');
// import our database connection from config.js
const sequelize = require('../config/connection');

// Initialize Product model (table) by extending off Sequelize's Model class
class Product extends Model { }

// set up fields and rules for Product model
Product.init(
  //product has an ID, product_name, price, stock and category_id.
  {
    // id is a primary key accepting numberic data input that cannot be null.
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    // product_name is a dataType that accepts strings and cannot be null
    product_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // price accepts dataTypes that are decimal friendly and cannot be null
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
      // stock accepts dataTypes that are Integers and cannot be null
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
       // category_id accepts dataTypes that are Integers, cannot be null, and is a foreign key to category.
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'category',
        key: 'id',
        unique: false
      }
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
);

module.exports = Product;
