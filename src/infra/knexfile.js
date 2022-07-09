import dotenv from 'dotenv'
import knex from 'knex'

dotenv.config({path:'../.env'});
//('dotenv').config({path:'../.env'});


const db_connection = knex({
    client: 'mysql2',
    connection: {
      host : '127.0.1.1',
      port : 3306,
      user : 'root',
      password : '123',
      database : 'formulario-chat'
    }
  });

  export { db_connection }