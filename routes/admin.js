const express = require('express')
const mongoose = require('mongoose')

require('../models/Categoria')
const Categoria = mongoose.model('categorias')

const router = express.Router()

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/posts', (req, res) => {
    res.send("Página de posts")
})

router.get('/categorias', (req, res) => {
    Categoria.find().sort({date:'desc'}).then((categorias)=>{
        res.render('admin/categorias', {categorias: categorias})

    }).catch((erro)=>{
        req.flash('error_msg', 'Houve um erro na listagem das categorias')
        res.redirect('/admin')
    })
})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias')
})

router.post('/categorias/nova', (req, res) => {

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
            req.flash("error_msg", "Houve um erro ao salvar a Categoria")
            console.log("Erro ao salvar categoria: "+erro)
            res.redirect('/admin')
        })
    }
})

router.get('/categorias/edit/:id', (req, res)=>{
    Categoria.findOne({_id: req.params.id}).then((categoria)=>{
        res.render('admin/editcategorias', {categoria: categoria})
    }).catch((erro)=>{
        req.flash('error_msg', 'Nenhuma categoria encontrada com este id '+req.params.id)
    })
})

router.post('/categorias/edit', (req, res)=>{
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


router.post('/categorias/delete', (req, res)=>{
    Categoria.deleteOne({_id: req.body.id}).then(()=>{
        req.flash('success_msg', 'Categoria deletada com sucesso')
        res.redirect('/admin/categorias')
    }).catch((erro)=>{
        req.flash('error', 'Houve um erro ao deletar a categoria') 
        res.redirect('/admin/categorias')  
    })
})
module.exports = router