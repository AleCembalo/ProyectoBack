import * as chai from 'chai';
import mongoose from 'mongoose';
import supertest from 'supertest';

const connection  = await mongoose.connect('mongodb+srv://CoderBack:coderback2024@clustercoder.7swfcjo.mongodb.net/ecommerce');
const expect = chai.expect;
const cartId = new mongoose.Types.ObjectId();
let cookieData = {};

const requester = supertest('http://localhost:8080');
const testUser = { firstName: 'Juana', lastName: 'Cembalo', email: 'jj@gmail.com', age: 30, role: 'admin', password: 'abc123', cartId: cartId };

describe('Test Integración Users', function () {
    before(async function () {});
    beforeEach(function () {});
    after(function () {});
    afterEach(function () {
        this.timeout = 5000;
    });
    
    it('POST /api/auth/register debe registrar un nuevo usuario', async function () {
        const { _body }  = await requester.post('/api/auth/register').send(testUser);
        
        expect(_body.payload).to.be.ok;
        expect(_body._id).to.be.not.null;
    });

    it('POST /api/auth/register NO debe volver a registrar el mismo mail', async function () {
        const { statusCode, _body }  = await requester.post('/api/auth/register').send(testUser);

        expect(statusCode).to.be.equals(400);
    });

    it('POST /api/auth/login debe ingresar correctamente al usuario', async function () {
        
        const result = await requester.post('/api/auth/login').send({email: 'jj@gmail.com', password: 'abc123'});
        cookieData = result.headers['set-cookie'][0];
        const cookie = { name: cookieData.split('=')[0], value: cookieData.split('=')[1] };

        expect(result).to.be.ok;
        expect(cookie.name).to.be.equals('connect.sid');
        expect(cookie.value).to.be.ok;
    });

    it('GET /api/auth/current debe retornar datos correctos de usuario', async function () {
        const {_body, statusCode} = (await requester.get('/api/auth/current').set('Cookie', cookieData));
        
        expect(_body.payload).to.have.property('lastName');
        expect(_body.payload).to.have.property('role');        
        expect(_body.payload).to.have.property('email').and.to.be.eql(testUser.email);
    });
});