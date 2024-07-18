import config from '../config.js';

let factoryCartsService = {};

switch (config.PERSISTENCE) {
    case 'FILE':
        console.log('Persistencia a FILE');
        const RamService = await import('./fs/carts.dao.fs.js');
        factoryCartsService = RamService.default;
        break;

    case 'MONGO':
        console.log('Persistencia a MONGODB');
        const { default: MongoSingleton } = await import('../services/mongo.singleton.js');
        await MongoSingleton.getInstance();
        
        const MongoService = await import('./mongo/carts.dao.mdb.js');
        factoryCartsService = MongoService.default;
        break;
        
    default:
        throw new Error(`Persistencia ${config.PERSISTENCE} no soportada`);
}

export default factoryCartsService;
