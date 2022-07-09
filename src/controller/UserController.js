import { db_connection } from '../infra/knexfile.js';

export default class UserController {
    async createUser(request, response) {
        const { name, password, email, birthDate } = request.body;
        const [dbresponse] = await db_connection('usuarios').insert({
            nome: name,
            senha: password,
            email: email,
            data_nasc: birthDate
        }).returning('*')
    
        return response.status(201).json({ user_id: dbresponse });
    }

    async getUsers(request, response) {
        const dbResponse = await db_connection('usuarios').select('*');

        return response.status(200).json(dbResponse);
    }

    async getOneUser(request, response) {
        const { id } = request.params;
        console.log(id);
        const dbResponse = await db_connection('usuarios').where({ id: Number(id) }).select('*');

        return response.status(200).json(dbResponse);
    }

}
