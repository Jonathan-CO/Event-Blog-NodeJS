//carregando módulos
    const express = require ('express')
    const handlebars = require ('express-handlebars')
    const app = express()
    const admin = require('./routes/admin')
    const path = require('path')
    const session = require('express-session')
    const flash = require('connect-flash')

    require('./models/db')

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
 
    // express json
    app.use(express.json())

    //handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    //Public
    app.use(express.static(path.join(__dirname, 'public')))


//rotas
app.use('/admin', admin)

//outros



const port = 8081
app.listen(port, () => {
    console.log("Servidor rodando")
})

