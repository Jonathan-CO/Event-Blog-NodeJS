//carregando módulos
    const express = require ('express')
    const handlebars = require ('express-handlebars')
    //const mongoose = require('mongoose')
    const app = express()

 //configurações
    // express json
    app.use(express.json())

    //handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    // mongoose
//rotas

//outros

const port = 8081
app.listen(port, () => {
    console.log("Servidor rodando")
})