const express = require('express')
const mongoose = require('mongoose')

require('../models/Categoria')
require('../models/Postagem')
const Categoria = mongoose.model('categorias')
const Postagem = mongoose.model('postagens')

const router = express.Router()

const {eAdmin}= require('../helpers/eAdmin') // verifica se é admin

// Rotas gerais

router.get('/', eAdmin, (req, res) => {
    res.render('admin/index')
})

router.get('/posts', eAdmin, (req, res) => {
    res.send("Página de posts")
})

// Rotas /categorias

router.get('/categorias', eAdmin, (req, res) => {
    Categoria.find().sort({date:'desc'}).then((categorias)=>{
        res.render('admin/categorias', {categorias: categorias})

    }).catch((erro)=>{
        req.flash('error_msg', 'Houve um erro na listagem das categorias')
        res.redirect('/admin')
    })
})

router.get('/categorias/add', eAdmin, (req, res) => {
    res.render('admin/addcategorias')
})

router.post('/categorias/nova', eAdmin, (req, res) => {

    var erros =[]
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({ texto: "nome inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({ texto: "slug inválido"})
    }

    if(erros.length > 0){
        res.render('admin/addcategorias', {erros: erros})
    }else{
        const novaCategoria = {
            nome : req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(()=>{
            req.flash("success_msg", "Categoria criada com sucesso")
            res.redirect('/admin/categorias')
        }).catch((erro) => {
            console.log(erro)
            req.flash("error_msg", "Houve um erro ao salvar a Categoria: "+erro)
            res.redirect('/admin/categorias')
        })
    }
})

router.get('/categorias/edit/:id', eAdmin, (req, res)=>{
    Categoria.findOne({_id: req.params.id}).then((categoria)=>{
        res.render('admin/editcategorias', {categoria: categoria})
    }).catch((erro)=>{
        req.flash('error_msg', 'Nenhuma categoria encontrada com este id '+req.params.id)
    })
})

router.post('/categorias/edit', eAdmin, (req, res)=>{
    Categoria.findOne({_id: req.body.id}).then((categoria)=>{
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(()=>{
            req.flash("success_msg", 'Categoria salva com sucesso')
            console.log("sucesso")
            res.redirect('/admin/categorias')
        }).catch((erro)=>{
            req.flash('error_msg', 'Não foi possível salvar')
            res.redirect('/admin/categorias')
        })
    }).catch((erro)=>{
        req.flash('error_msg', 'Houve um erro ao editar')
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/delete', eAdmin, (req, res)=>{
    Categoria.deleteOne({_id: req.body.id}).then(()=>{
        req.flash('success_msg', 'Categoria deletada com sucesso')
        res.redirect('/admin/categorias')
    }).catch((erro)=>{
        req.flash('error', 'Houve um erro ao deletar a categoria') 
        res.redirect('/admin/categorias')  
    })
})


// Rotas /postagens

router.get('/postagens', eAdmin, (req, res)=>{
    Postagem.find().populate('categoria').sort(({data: 'desc'})).then((postagens)=>{
        res.render('admin/postagens', {postagens: postagens})
    }).catch((erro)=>{
        console.log(erro)
        req.flash('error_msg', 'houve um erro ao listar as postagens')
        res.redirect('/admin')
    })
})

router.get('/postagens/add', eAdmin, (req, res) => {
    Categoria.find().then((categorias)=>{
        res.render('admin/addpostagens', {
            categorias: categorias
        })
    }).catch((erro)=>{
        req.flash("error_msg", "Houve um erro ao carregar o formulario")
        res.redirect('/admin')
    })
})

router.post('/postagens/nova', eAdmin, (req, res) => {

    var erros =[]
    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({ texto: "titulo inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({ texto: "slug inválido"})
    }

    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({ texto: "descricao inválido"})
    }

    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        erros.push({ texto: "conteudo inválido"})
    }

    if(!req.body.categoria){
        erros.push({ texto: "Categoria inválida"})
    }

    if(erros.length > 0){
        res.render('admin/addpostagens', {erros: erros})
    }else{
        const novaPostagem = {
            titulo : req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }
        new Postagem(novaPostagem).save().then(()=>{
            req.flash("success_msg", "Postagem criada com sucesso")
            res.redirect('/admin/postagens')
        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro ao salvar a Postagem")
            console.log("Erro ao salvar postagem: "+erro)
            res.redirect('/admin/postagens')
        })
    }
})

router.get('/postagens/edit/:id', eAdmin, (req, res)=>{
    Postagem.findOne({_id: req.params.id}).then((postagem)=>{
        Categoria.find().then((categorias)=>{
            res.render('admin/editpostagens', {
                postagem: postagem,
                categorias: categorias
            })

        }).catch((erro)=>{
            req.flash('error_msg', 'Houve um erro ao carregar a edição')
            res.redirect('/admin/postagens')
        })
    }).catch((erro)=>{
        req.flash('error_msg', 'Houve um erro ao carregar a edição')
        res.redirect('/admin/postagens')
    })
})

router.post('/postagens/edit', eAdmin, (req, res)=>{
    Postagem.findOne({_id: req.body.id}).then((postagem)=>{

        postagem.titulo = req.body.titulo,
        postagem.slug = req.body.slug,
        postagem.descricao = req.body.descricao,
        postagem.conteudo = req.body.conteudo,

        postagem.save().then(()=>{
            req.flash('success_msg', 'Postagem editada com sucesso')
            res.redirect('/admin/postagens')
        }).catch((erro)=>{
            req.flash('error_msg', 'Houve um erro ao salvar a mensagem')
            res.redirect('/admin/postagens')
        })

    }).catch((erro)=>{
        req.flash('error_msg', 'Houve um erro ao salvar a edição')
        res.redirect('/admin/postagens')
    })
})

router.get('/postagens/deletar/:id', eAdmin, (req, res)=>{
    Postagem.deleteOne({_id: req.params.id}).then(()=>{
        req.flash('success_msg', 'Postagem deletada com sucesso')
        res.redirect('/admin/postagens')
    }).catch((erro)=>{
        req.flash('error_msg', 'Houve um erro ao delear a postagem')
        res.redirect('/admin/postagens')
    })
})

module.exports = router