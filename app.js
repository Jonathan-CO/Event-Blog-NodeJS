//carregando módulos
    const express = require ('express')
    const handlebars = require ('express-handlebars')
    const app = express()
    const admin = require('./routes/admin')
    const path = require('path')
    const session = require('express-session')
    const flash = require('connect-flash')
    const mongoose = require('./models/db')
    
    require('./models/Postagem')
    const Postagem = mongoose.model('postagens')
    
    // express json
    app.use(express.urlencoded({extended: true}))
    app.use(express.json())

     
 //configurações
    //session
    app.use(session({
        secret: 'cursodenode',
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())

    //Middleware
    app.use((req, res, next)=>{ // res.locals cria variáveis globais
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
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

app.get('/404', (req, res)=>{
    res.send('Erro 404!')
})

app.use('/admin', admin)

//outros



const port = 8081
app.listen(port, () => {
    console.log("Servidor rodando")
})

