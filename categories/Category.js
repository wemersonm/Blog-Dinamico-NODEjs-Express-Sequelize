const Sequelize = require("sequelize");

const connection = require("../database/database");

const Category = connection.define("categories", {
  title: {
    type: Sequelize.STRING,
    allowNull: false, // nao permite dados nulos
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Category;
