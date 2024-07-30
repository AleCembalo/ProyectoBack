import winston from 'winston';
import config  from '../config.js';

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        debug: 'white',
        http: 'green'
    }
};

const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console(
            {
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevelsOptions.colors }),
                    winston.format.simple()
                )
            }
        ),
        new winston.transports.File(
            {
                level: 'debug',
                filename: `${config.DIRNAME}/logs/errors.log`,
                format: winston.format.simple()
            }
        )
    ]
});

const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console(
            { 
                level: 'info',
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevelsOptions.colors }),
                    winston.format.simple()
                )
            }
        ),
        new winston.transports.File(
            {
                level: 'warning', 
                filename: `${config.DIRNAME}/logs/errors.log`
            }
        )
    ]
});

export const logger = config.MODE === 'prod' ? prodLogger : devLogger;

const addLogger = (req, res, next) => {
    if (config.MODE === 'prod') {
        req.logger = prodLogger;
        req.logger.info(`${req.method} in ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    } else {
        req.logger = devLogger;
    }
    next();
}

export default addLogger;