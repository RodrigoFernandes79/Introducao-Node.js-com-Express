const express = require('express')

//CRIANDO O bodyParser para fazer o corpo da requisição body
const bodyParser = require('body-parser')

//importar módulos:
const userRouter = require('./routes/users-routes')
    //porta do localhost:
const port = 3000
    //configurar a Api:
const app = express()
    //AVISANDO AO NODE QUE  SERÁ USADA O bodyParser NA APLICAÇAO:
app.use(bodyParser.urlencoded({ extended: false }))

userRouter(app)


app.get("/", (req, res) => res.send("olá Mundo!"))
    //para executar no localhost:3000
app.listen(port, () => console.log(`Express rodando na porta ${port}`))