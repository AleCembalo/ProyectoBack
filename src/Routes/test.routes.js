import CustomRouter from './custom.router.js';

export default class TestRouter extends CustomRouter {

    init () {

        this.get('/loggertest', (req, res) => {
            req.logger.fatal("Prueba de log level fatal!");
            req.logger.error("Prueba de log level error!");
            req.logger.warning("Prueba de log level warning!");
            req.logger.http("Prueba de log level http!");
            req.logger.info("Prueba de log level info!");
            req.logger.debug("Prueba de log level debug!");
            res.status(200).json({test: 'logs hechos'});
        });
    }
}