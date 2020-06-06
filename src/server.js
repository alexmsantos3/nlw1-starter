const express = require("express")
const server = express()

//Pegar o banco de dados
const db = require("./database/db")

//Configurar pasta publica
server.use(express.static("public"))

//Habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({extended: true}))


//###################################################################################
//Utilizando template engine -- Nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

//###################################################################################
//Configurar caminhos da minha aplicação
//Página inicial #######################################
//Req: Requisição
//Res: Resposta
//"function(x, y) {}"  é o mesmo que  "(x, y) => {}"  com 1 argumento "1argu => {}" ou "1argu => 1comando"
server.get("/", (req, res) => {
    //res.send("Hello world!")
    //"__dirname" var global que pega todo o caminho até a pasta atual
    //res.sendFile(__dirname + "/views/index.html")  foi substituida devido ao nunjucks
    return res.render("index.html")
})



//Página de cadastro do ponto de coleta ################
server.get("/create-point", (req, res) => {
    //req.query: "query strings" da url(vem após a "?" na url)
    console.log(req.query);

    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    //req.body: O corpo do nosso formulário
    //console.log(req.body);
    
    //Inserir dados no banco de dados
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
       req.body.image,
       req.body.name,
       req.body.address,
       req.body.address2,
       req.body.state,
       req.body.city,
       req.body.items
    ]

    function afterInsertData(err) {
        if(err) {
            console.log(err);
            //return res.send("Erro no cadastro!")
            return res.render("create-point.html", {erro: true})

         }
 
         console.log("Cadastrado com sucesso!");
         console.log(this); //this funciona de maneira diferente em arrow function
         
        //return res.send("ok")
        return res.render("create-point.html", {saved: true})
    }
    db.run(query, values, afterInsertData)
})


//Página do resultado da busca #########################
server.get("/search", (req, res) => {
    const search = req.query.search

    if(search == "") {
        //pesquisa vazia
        return res.render("search-results.html", {total: 0}) 
    }

    //Pegar os dados do banco de dados
    // db.all(`SELECT * FROM places WHERE city = '${search}'`, function(err, rows){         ****valor exato****
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {  // ****valor que contém****
        if(err) {
            return console.log(err);
        }
        // console.log("Aqui estão seus registros: ");
        // console.log(rows); 
        const total = rows.length
        //Mostrar a página html com os dados do banco de dados
        return res.render("search-results.html", {places: rows, total: total})       
    })

    
})

//###################################################################################
//Ligar o servidor 
server.listen(3000)
