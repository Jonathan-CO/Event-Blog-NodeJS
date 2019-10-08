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
    res.render('admin/categorias')
})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias')
})

router.post('/categorias/nova', (req, res) => {
    const novaCategoria = {
        nome : req.body.nome,
        slug: req.body.slug
    }
    new Categoria(novaCategoria).save().then(()=>{
        console.log("Categoria salva")
    }).catch((erro) => {
        console.log("Erro ao salvar categoria: "+erro)
    })
})

module.exports = router