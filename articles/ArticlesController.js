const express = require("express"); //exporta o express
const router = express.Router(); //cria o obj de rotas
const Category = require("../categories/Category"); //importa a banco com a tabela de categorias
const Article = require("./Article");//importa a banco com a tabela de artigos
const slugify = require("slugify"); //importa o slugify
const adminAuth = require('../middlewares/adminAuth') // middleware para autenticacao


router.get("/admin/articles",adminAuth, (req, res) => { // rota para exibir os artigos
  Article.findAll({ //busca todos os dados da tabela artigos
    include: [{ model: Category }], //join para pegar dados da tabela  de categorias
  }).then((articles) => { //passa os dados da tabela da view atraves da variavel articles armaz. um obj 
    res.render("admin/articles/index", { articles: articles }); //renderiza um arquivo no diretorio passando o obj articles que tem os dados dos artigos(tabela)
  });
});

router.get("/admin/articles/new",adminAuth, (req, res) => { // rota para criar as categorias
  Category.findAll().then((categories) => { // busca todos os dados da tabela categorias
    res.render("admin/articles/new", { categories: categories }); //renderiza os dados na view no diretorio passando os obj categorias
  });
});

router.post("/articles/save", (req, res) => { //rota para salvar os artigos via form method POST
  // apontando para '/articles/save' no action do form
  //Pega os dados do form passado pelo 'NAME' do form
  const title = req.body.title; 
  const body = req.body.body;
  const category = req.body.category;


  Article.create({ //setar dados na tabela de artigos passando title, slug,body e categoryId da tabela category
    title: title,
    slug: slugify(title),
    body: body,
    categoryId: category,
  }).then(() => {
    res.redirect("/admin/articles"); //apos setar redirecionar para lista de artigos
  });
});

router.post("/articles/delete", (req, res) => { //rota method post para deletar artigo
  const id = req.body.id; //pega o id do artigo passado pelo input(hidden) no form para deletar apontando(action) para articles/delete
  if (id != undefined) { 
    if (!isNaN(id)) {
      Article.destroy({ //na tabela artigos deletar
        where: { //os dados onde tem o id
          id: id,
        },
      }).then(() => { //apos deletar redirecionar para pagina de artigos
        res.redirect("/admin/articles");
      });
    } else {
      res.redirect("/admin/articles");
    }
  } else {
    res.redirect("/admin/articles");
  }
});

router.get("/admin/articles/edit/:id", (req, res) => { // rota para renderizar a view de editar
  const id = req.params.id; //pega o id passado por parametro

  Article.findByPk(id) //busca o dado da tabela usando a chave primaria id 
    .then((article) => {
      if (article) { //se o artigo encontrado for truthy
        Category.findAll().then((categories) => {
          res.render("admin/articles/edit", { //passa os dados para view de edit pasando o obj de artigo e o de category que tem o categoryId
            categories: categories,
            article: article,
          });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      res.redirect("/");
    });
});

router.post("/articles/update", (req, res) => { //rotaa pra update de artigo method post e no form apontando para essa rota
  // pega os dados passado no form->input->name = form que tem o action apontado para essa rota
  const id = req.body.id;
  const title = req.body.title;
  const body = req.body.body;
  const category = req.body.category;

  Article.update( // mudar os dados do artigos dos campos abaixo
    { title: title, slug: slugify(title), body: body, categoryId: category },
    {
      where: { //onde o id = id passado 
        id: id,
      },
    }
  )
    .then(() => {
      res.redirect("/admin/articles");
    })
    .catch((err) => res.redirect("/admin/articles"));
});

// logica para paginacao dos artigos para os usuarios
router.get("/articles/page/:num", (req, res) => {
  const page = req.params.num;
  let offset = 0;

  if (isNaN(page) || page == 1) {
    offset = 0;
  } else {
    offset = (parseInt(page) - 1) * 4;
  }

  Article.findAndCountAll({ // findandCountAll para lidar com paginação
    limit: 4, //limite de 4 artigos por pagina
    order: [["id", "DESC"]], // ordem decrescente por id(o mais recente aprece)
    offset: offset,
  }).then((articles) => {// passa o obj artigos
    let next;           //saber se tem uma proxima pag da paginação

    if (offset + 4 >= articles.count) { //se a qtd de ofset > indice do artigo
      next = false;
    } else {
      next = true;
    }

    const result = { //obj com as info da paginacao da atual page,existe proxima page e os artigos
      page: parseInt(page),
      next: next,
      articles: articles,
    };
    Category.findAll().then((categories) => { // mostra todos os artgos para render de paginação
      res.render("admin/articles/page", {
        categories: categories,
        result: result,
      });
    });
  });
});

 //mostra todos os usuarios cadastrados
router.get('/admin',adminAuth,(req,res)=>{
  res.render('admin/index')
})
module.exports = router;
