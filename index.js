const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const connection = require('./database/database')
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UsersController')
const Category = require('./categories/Category');
const Article = require('./articles/Article');
const slugify = require('slugify');
const session = require('express-session')

connection.authenticate().then(()=>{
    console.log('Banco de dados conectado !')
}).catch(error =>{
    console.log('Erro na conexao bando de dados '+error)
})


app.set('view engine','ejs');

const time = 15*1000;
app.use(session({
    secret:'fds',  //aumentar seg da sessao, +- o salt do bcrypt
    cookie:{maxAge:time}
}))


app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());


app.use(express.static('public'))




app.use('/',categoriesController)
app.use('/',articlesController)
app.use('/',usersController)



app.get('/',(req,res) =>{
    const id = req.body.id
    Article.findAll({
        order:[
            ['id','DESC']
        ],
        limit:4
    }).then((articles)=>{
        Category.findAll().then((categories)=>{

            res.render('index',{articles:articles,categories:categories})
        })
    })
   
})

app.get('/:slug',(req,res)=>{

    const slug = req.params.slug;

    Article.findOne({
        where:{
            slug:slug
        }
    }).then(article =>{
        if(article){
            Category.findAll().then((categories)=>{

                res.render('article',{article:article,categories:categories})
            })
        }
        else{
            res.redirect('/')
        }
        
    }).catch(err => res.redirect('/'))

})


app.get('/category/:slug',(req,res)=>{
    const slug = req.params.slug;

    Category.findOne({
        where:{
            slug:slug
        },
        include:[{model:Article}] // join
    }).then((category)=>{
        if(category){
            Category.findAll().then((categories)=>{
                res.render('index',{articles: category.articles, categories:categories})

            })
        }else{
            res.redirect('/')
        }
    }).catch(err => res.redirect('/'))
})



app.listen(3000,()=>{
    console.log('Servidor ON')
})