import CustomRouter from './custom.router.js';
import { uploader } from '../services/uploader.js';
import config from '../config.js';
import { handlePolicies, verifyToken } from '../services/utils.js';


export default class UploadsRouter extends CustomRouter {
    
    init () {

        this.post('/products', uploader.array('productImages', 3), (req, res) => {
            res.status(200).send({ status: 'OK', payload: 'Imágenes subidas', files: req.files})
        });

        this.post('/profile', uploader.array('profilesImages', 3), (req, res) => {
            res.status(200).send({ status: 'OK', payload: 'Imágenes subida', files: req.files})
        });
        
        this.post('/documents', uploader.array('documents', 3), (req, res) => {
            res.status(200).send({ status: 'OK', payload: 'Documentos subidas', files: req.files})
        });
    }
}