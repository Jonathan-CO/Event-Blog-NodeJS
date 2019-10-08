//carregando módulos
    const express = require ('express')
    const handlebars = require ('express-handlebars')
    
    const app = express()
    const admin = require('./routes/admin')
    const path = require('path')

    const mongoose = require('./models/db')

 //configurações
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

