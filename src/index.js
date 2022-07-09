import express, { json } from 'express';
import cors from "cors";
import { db_connection } from './infra/knexfile.js';
import { authenticationMiddleware } from './infra/routes/middlewares/index.js';
import { userRoutes } from './infra/routes/user/index.js';
import { messageRoutes } from './infra/routes/message/index.js';

const whitelist = ["http://localhost:3000"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}

const app = express();
app.use(cors(corsOptions))
app.use(json());

//middle impossibilita o usuário de usar outras telas quando não estiver logado
//next é um callback quando ele termina de executar uma função ele chama a proxima

app.post('/login', async function (request, response) {
  const { email, senha } = request.body;

 if (!email || !senha) return response.status(400).json({ error: 'Missing Parameters' });

  const user = await db_connection('usuarios').where({ email: email, senha: senha }).select();
  console.log(user);
  if (!user.length) return response.status(204).send();

  return response.status(200).json({
    server: 'Sucessfull Login!',
    useridentifier: user[0].id
  });
});

app.use(authenticationMiddleware)

app.use('/user', userRoutes);
app.use('/messages', messageRoutes);

app.listen(5000, function () {
  console.log("Server is running!");
})

export default { app };