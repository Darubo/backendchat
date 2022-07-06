const express = require('express'); //importa o express
const { db_connection } = require('./infra/knexfile'); //destrutor para destruir o objeto e pegou apenas o atributo


const app = express();   //executa o express
app.use(express.json());

async function authenticationMiddleware(request, response, next){ 
    const{useridentifier} = request.headers; //uma boa pratica e mais segura seria utilizar um JWT com passport
    
    if(!useridentifier) return response.status(401).json({ error: 'Invalid User '});
    
    const [user] = await db_connection('usuarios').where({ id: Number(useridentifier) }).select();

    if(!user) return response.status(403).json({error: 'Forbidden user'})

    request.user = user;
    return next();

};
 //middle impossibilita o usuário de usar outras telas quando não estiver logado
  //next é um callback quando ele termina de executar uma função ele chama a proxima

app.post('/user', authenticationMiddleware, async function (request, response){
    const { name, password, email, birthDate } = request.body;
    const [db_response] = await db_connection('usuarios').insert({
        nome: name, 
        email: email,
        data_nasc: birthDate,
        senha: password
    });
    console.log(db_response);
    return response.status(200).json({user_id: db_response});

});


app.post('/login', async function(request,response){
    const { email, password } = request.body;

    if(!email || !password) return response.status(400).json({error: 'Missing Parameters'});

    const user = await db_connection('usuarios').where({email: email, senha: password}).select();

    if(!user.length) return response.status(204).send();

    return response.status(200).json({server: 'Sucessfull Login!'});
});


app.get('/user',authenticationMiddleware, async function (request, response){
    const dbResponse = await db_connection('usuarios').select();

    return response.json(dbResponse)

});

app.get('/messages/sent', authenticationMiddleware, async (request, response) =>{
    const { user } = request;

    const messages = await db_connection('user_message')
    .where({sender_identifier: Number(user.id) })
    .select()
    .orderBy('createdAt', 'desc');
    
    return response.status(200).json(messages);
});

app.get('/messages/received', authenticationMiddleware, async (request, response) =>{
    const { user } = request;

    const messages = await db_connection('user_message')
    .where({receiver_identifier: Number(user.id) })
    .select()
    .orderBy('createdAt', 'desc');

    return response.status(200).json(messages);
});

app.post('/message', authenticationMiddleware, async function(request, response){
    const { user } = request;
    const { message, receiverId } = request.body;
    
    await db_connection('user_message').insert({
        sender_identifier: Number(user.id),
        message: message,
        createdAt: new Date(),
        receiver_identifier: Number(receiverId)
});

    return response.status(200).send();

});

app.listen(5000, function(){
    console.log("Server is running!");
})

module.exports = { app };