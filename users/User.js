const Sequelize = require("sequelize");

const connection = require("../database/database");

const User = connection.define("users", {
  email: {
    type: Sequelize.STRING,
    allowNull: false, // nao permite dados nulos
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
// força criar tabela
User.sync({force:false})
module.exports = User;
