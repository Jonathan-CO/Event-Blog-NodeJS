//carregando módulos
    const express = require ('express')
    const handlebars = require ('express-handlebars')
    //const mongoose = require('mongoose')
    const app = express()

    //configurações

//rotas

//outros

const port = 8081
app.listen(port, () => {
    console.log("Servidor rodando")
})