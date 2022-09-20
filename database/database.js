const Sequelize = require('sequelize');

const connection = new Sequelize('criapress','root','123456',{
    host:'localhost',
    dialect:'mysql',
    timezone:'-03:00'
})

module.exports = connection