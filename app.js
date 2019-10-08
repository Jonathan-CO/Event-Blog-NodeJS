//carregando módulos
    const express = require ('express')
    const handlebars = require ('express-handlebars')
    const mongoose = require('mongoose')
    const app = express()
    const admin = require('./routes/admin')
    const path = require('path')


 //configurações
    // express json
    app.use(express.json())

    //handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    // mongoose
    mongoose.connect('mongodb+srv://blog:blog@blog-pjdr7.mongodb.net/blognodejs?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>{
        console.log("Conectado")
    }).catch((erro)=>{
        console.log("Erro ao conectar: "+erro)
    })

    //Public
    app.use(express.static(path.join(__dirname, 'public')))

//rotas
app.use('/admin', admin)

//outros

const port = 8081
app.listen(port, () => {
    console.log("Servidor rodando")
})

