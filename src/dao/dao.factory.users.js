import config from '../config.js';

let factoryUsersService = {};

switch (config.PERSISTENCE) {
    case 'FILE':
        console.log('Persistencia a FILE');
        const RamService = await import('./fs/users.dao.fs.js');
        factoryUsersService = RamService.default;
        break;

    case 'MONGO':
        console.log('Persistencia a MONGODB');
        const { default: MongoSingleton } = await import('../services/mongo.singleton.js');
        await MongoSingleton.getInstance();
        
        const MongoService = await import('./mongo/users.dao.mdb.js');
        factoryUsersService = MongoService.default;
        break;
        
    default:
        throw new Error(`Persistencia ${config.PERSISTENCE} no soportada`);
}

export default factoryUsersService;
