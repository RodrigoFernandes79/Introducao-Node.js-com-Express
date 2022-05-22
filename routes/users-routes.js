// fs é uma biblioteca pra lidar com arquivos de sistema(firesystem):
const fs = require('fs')
const { join } = require('path')

// simulando um banco de dados:
const filePath = join(__dirname, 'users.json');

// PREPARANDO O MÉTODO getUsers para mostrar usuários NO BD
const getUsers = () => {
    const data = fs.existsSync(filePath) // => se existe algum dado no filePath(nosso Banco de dados)
        ?
        fs.readFileSync(filePath) //=> ele retorna os dados que estao no BD
        :
        [] //=> senão , ele retorna um Array vazio.


    //Faremos um TryCatch:
    try {
        return JSON.parse(data)
    } catch (e) {
        return []
    }
};

// PREPARANDO O MÈTODO saveUser para salvar Usuários  NO BD
const saveUser = (users) => fs.writeFileSync(filePath, JSON.stringify(users, null, '\t'))

//CRIANDO OS METODOS GET , POST PUT E DELETE
const userRouter = (app) => {
    //PASSANDO A URL
    app.route('/users/:id?')
        //GET PEGA O getUsers() do filePath e envia o corpo da resposta na requisição
        .get((req, res) => {
            const users = getUsers()
            res.send({ users })
        })
        /*POST PEga O getUsers() do filepath ,abre um push no corpo da requisição
e ao inseirir os dados na requisiçao , ele salva e nos retorna o status 201*/
        .post((req, res) => {
            const users = getUsers()

            users.push(req.body)
            saveUser(users)

            res.status(201).send('Created')
        })

    /*MÈTODO PUt TB PEGA O getUsers() DO filePath, DÁ UM map() NOS DADOS DE user E SE O id DO BD FOI IGUAL AO ID
    QUE ESTAMOS PASSANDO COMO PARÂMETRO, ELE SALVA E  NOS RETORNA OS DADOS ATUALIZADOS, SE O id NÃO FOR IGUAL,
     ELE RETORNA COM OS MESMOS DADOS DE ANTES E ATUALIZANDO OU NÃO , RETORNA O STATUS 200 OK*/
    .put((req, res) => {
            const users = getUsers()
            saveUser(users.map(user => {
                if (user.id === req.params.id) {
                    return {
                        ...user,
                        ...req.body
                    }
                }
                return user
            }))
            res.status(200).send('OK')
        })
        /*MÉTODO DELETE PEGA O getUsers() DO filePath , DÁ UM filter() ,FILTRANDO TODOS OS ids DO USUÁRIO E
        O id QUE FOR DIFERENTE DO BANCO DE DADOS COM O QUE ESTAMOS PASSANDO COMO PARÂMETRO , ELE NÃO FILTRA
        E COMO CONSEQUÊNCIA ELE  DELETA E NOS RETORNA COMO RESPOSTA O STATUS 200 OK*/
        .delete((req, res) => {
            const users = getUsers()
            saveUser(users.filter(user => user.id != req.params.id))

            res.status(200).send('OK')
        })
}

//EXPORTAR O MODULO userRouter PARA A CLASSE DE EXECUÇÃO index>js:
module.exports = userRouter