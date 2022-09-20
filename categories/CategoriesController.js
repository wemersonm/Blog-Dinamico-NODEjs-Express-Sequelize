// requires 
const express = require("express");
const router = express.Router(); //cria variavel router para criar as rotas
const Category = require("./Category"); //importa a tabela categorias

const slugify = require("slugify");

const adminAuth = require('../middlewares/adminAuth') //middleware de autenticação


router.get("/admin/categories/new", adminAuth,(req, res) => { // rota para criar categorias
  res.render("admin/categories/new"); //renderiza a view de criação de categorias
});

router.post("/categories/save", (req, res) => { //rota de post para salvar os dados da criação de categorias
// o action do form aponta para essa rota /categories/save,
  var title = req.body.title; // pega o dado do input->name 

  if (title != undefined) { //se o titulo NÃO for falSY
    Category.create({ //cria na tabela setando o titulo, ... campos/keys
      title: title,
      slug: slugify(title),
    }).then(() => {
      res.redirect("/admin/categories"); // apos criar redirecionar para pagina de listagem de categories
    });
  } else {
    res.redirect("/admin/categories/new"); //se der ruim redireciona para criar a categoria novamente
  }
});

router.get("/admin/categories",adminAuth, (req, res) => { // listar categorias
  Category.findAll().then((categories) => { //pega todas as categorias
    res.render("admin/categories/index", { categories: categories }); // renderizar a view que mostra as categorias
  });
});

router.post("/categories/delete", (req, res) => { //rota para deletar onde o form aponta para essa rota
  var id = req.body.id;

  if (id != undefined) {
    if (!isNaN(id)) {
      Category.destroy({ //deleta o dado que tem o id  passado pelo input->hidden
        where: {
          id: id,
        },
      }).then(() => {
        res.redirect("/admin/categories"); // apos deletar redireciona para essa rota
      }); //se der ruim retorna para listagem de categorias
    } else {
      res.redirect("/admin/categories");
    }
  } else {
    res.redirect("/admin/categories");
  }
});

router.get("/admin/categories/edit/:id", adminAuth,(req, res) => { //rota que renderiza a page de editar categoria(parecida com a de new)
  // essa rota e ativada quanto clica no btn de edit nas acoes na listagem de categorias passando o id <%categories.id%> no href onde esta o :id
  const id = req.params.id;

  if (isNaN(id)) { //se o id nao e um numero
    res.redirect("/admin/categories");
  }
  Category.findByPk(id) //buscar atraves do id e
    .then((category) => { //retorna o dado(title) da categoria com o id
      if (category != undefined) { //a categoria for trurtly
        res.render("admin/categories/edit", { category: category }); //renderiza a view de edit e passa o obj category com os dados
      } else {
        res.redirect("/admin/categories");
      }
    })
    .catch((error) => {
      res.redirect("/admin/categories");
    });
});

router.post("/categories/update", (req, res) => { // rota que aponta para a action do form de edit da categoria
  //no form da rota de edit, o action aponta para essa rota que edita a categoria
  const id = req.body.id;
  const title = req.body.title;

  Category.update( //update no titulo e o slug
    { title: title, slug: slugify(title) },
    {
      where: { //onde tem o id informado/clicado na acao
        id: id,
      },
    }
  ).then(() => {
    res.render('../views/success');
    res.redirect("/admin/categories");//retorna para pagina de categorias se tudo der certo
  });
});
//exporta a rota
module.exports = router;
