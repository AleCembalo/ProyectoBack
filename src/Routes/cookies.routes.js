import CustomRouter from './custom.router.js';

export default class CookiesRouter extends CustomRouter {
    
    init () {

        this.get('/getcookies', async (req, res) => {
            try {
                const data = JSON.parse(req.signedCookies['codercookie']);
                res.sendSuccess( data );
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });
        
        this.get('/setcookie', async (req, res) => {
            try {
                const cookieData = { user: 'cperren', email: 'idux.net@gmail.com' };
                res.cookie('codercookie', JSON.stringify(cookieData), { maxAge: 30000, signed: true });
                res.sendSuccess( 'Cookie generada' );
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });
        
        this.get('/deletecookie', async (req, res) => {
            try {
                res.clearCookie('codercookie');
                res.sendSuccess( 'Cookie eliminada' );
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });
    }
}