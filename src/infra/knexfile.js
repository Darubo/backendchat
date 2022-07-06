require('dotenv').config({path:'../.env'});


const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : '127.0.1.1',
      port : 3306,
      user : 'root',
      password : '1234',
      database : 'formulario-chat'
    }
  });

  module.exports = { db_connection: knex }