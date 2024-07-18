import config from '../config.js';

let factoryProductsService = {};

switch (config.PERSISTENCE) {
    case 'FILE':
        console.log('Persistencia a FILE');
        const RamService = await import('./fs/products.dao.fs.js');
        factoryProductsService = RamService.default;
        break;

    case 'MONGO':
        console.log('Persistencia a MONGODB');
        const { default: MongoSingleton } = await import('../services/mongo.singleton.js');
        await MongoSingleton.getInstance();
        
        const MongoService = await import('./mongo/products.dao.mdb.js');
        factoryProductsService = MongoService.default;
        break;
        
    default:
        throw new Error(`Persistencia ${config.PERSISTENCE} no soportada`);
}

export default factoryProductsService;
