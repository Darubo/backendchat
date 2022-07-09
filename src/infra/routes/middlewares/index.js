import  { db_connection }  from '../../knexfile.js';

async function authenticationMiddleware(request, response, next) {
    const { useridentifier } = request.headers;
    
    if (!useridentifier) return response.status(401).json({ error: 'Invalid User' });
    
    const [user] = await db_connection('usuarios').where({ id: Number(useridentifier) }).select();

    if (!user) return response.status(403).json({ error: 'Forbidden user!' })

    request.user = user;
    return next();
}

export { authenticationMiddleware }
