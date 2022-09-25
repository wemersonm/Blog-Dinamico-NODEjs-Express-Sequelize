const Sequelize = require("sequelize"); //importar o sequelize
const connection = require("../database/database");// importar o bando de dados
const Category = require("../categories/Category"); // importar a tabela de categorias para o relacionamento

const Article = connection.define('articles',{ //cria a tabela articles
    title:{                                    // campo da tabela
        type: Sequelize.STRING,
        allowNull: false
    },slug: {                                    // campo da tabela
        type: Sequelize.STRING,
        allowNull: false    
    },          
    body: {                                        // campo da tabela
        type: Sequelize.TEXT,
        allowNull: false
    }
})


//relacionamento
Category.hasMany(Article); // UMA Categoria tem muitos artigos
Article.belongsTo(Category); // UM Artigo pertence a uma categoria

Article.sync({force:false}).then(()=>{});

module.exports = Article;
