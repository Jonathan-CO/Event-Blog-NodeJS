//carregando módulos
    const express = require ('express')
    const handlebars = require ('express-handlebars')
    const app = express()
    const admin = require('./routes/admin')
    const usuarios = require('./routes/usuario')
    const path = require('path')
    const session = require('express-session')
    const flash = require('connect-flash')
    const mongoose = require('./config/db')
    
    require('./models/Postagem')
    const Postagem = mongoose.model('postagens')
    
    require('./models/Categoria')
    const Categoria = mongoose.model('categorias')

    const passport = require('passport')
    require('./config/auth')(passport)

    // express json
    app.use(express.urlencoded({extended: true}))
    app.use(express.json())

     
 //configurações
    //Deve-se seguir essa ordem: sessão, passport, flash
    //session
    app.use(session({
        secret: 'cursodenode',
        resave: true,
        saveUninitialized: true
    }))

    app.use(passport.initialize())
    app.use(passport.session())

    app.use(flash())

    //Middleware
    app.use((req, res, next)=>{ // res.locals cria variáveis globais
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash('error') // para erros do passport
        res.locals.user = req.user || null; // armazena dados do usuario
        next()
    })

    //handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    //Public
    app.use(express.static(path.join(__dirname, 'public')))


    

//rotas
app.get('/', (req, res) =>{
    Postagem.find().populate('categoria').sort({date:'desc'}).then((postagens)=>{
        res.render('index', {postagens: postagens})
    }).catch((erro)=>{
        req.flash('error_msg', 'Erro ao busca postagens')
        res.redirect('/404')
    })
})

app.get('/postagem/:slug', (req, res)=>{
    Postagem.findOne({slug: req.params.slug}).then((postagem)=>{
        if(postagem){
            res.render('postagem/index', {postagem: postagem})
        }else{
            req.flash('error_msg', 'Esta postagem não existe')
            res.redirect('/')
        }
    }).catch((erro)=>{
        req.flash('error_msg', 'Houve um erro ao pesquisar a postagem')
        res.redirect('/')
    })
})

app.get('/categorias', (req, res)=>{
    Categoria.find().then((categorias)=>{
        res.render('categoria/index', {categorias: categorias})

    }).catch((erro)=>{
        req.flash('error_msg', 'Houve um erro ao listar as categorias')
        res.redirect('/')
    })
})

app.get('/categorias/:slug', (req, res)=>{
    Categoria.findOne({slug: req.params.slug}).then((categoria)=>{
        if(categoria){
            Postagem.find({categoria: categoria._id}).then((postagens)=>{
                res.render('categoria/postagens', {
                    categoria: categoria,
                    postagens: postagens
                })

            }).catch((error)=>{
                req.flash('error_msg', 'Houve um erro ao listar as postagens')
                res.redirect('/')
            })
        }else{
            req.flash('error_msg', 'Esta categoria não existe')
            res.redirect('/')
        }
    }).catch((erro)=>{
        req.flash('error_msg', 'Houve um erro ao pesquisar a categoria')
        res.redirect('/')
    })
})

app.get('/404', (req, res)=>{
    res.send('Erro 404!')
})

app.use('/admin', admin)
app.use('/usuarios', usuarios)
//outros



const port = process.env.PORT || 8081 //variável do ambiente(produção) ou 8081
app.listen(port, () => {
    console.log("Servidor rodando")
})

