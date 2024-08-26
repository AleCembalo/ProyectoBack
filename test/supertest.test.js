import * as chai from 'chai';
import mongoose from 'mongoose';
import supertest from 'supertest';

const connection  = await mongoose.connect('mongodb+srv://CoderBack:coderback2024@clustercoder.7swfcjo.mongodb.net/ecommerce');
const expect = chai.expect;
const cartId = new mongoose.Types.ObjectId();

const requester = supertest('http://localhost:8080');
const testUser = { firstName: 'Juana', lastName: 'Cembalo', email: 'jcembalo@gmail.com', age: 30, role: 'premium', password: 'abc123', cartId: cartId };

describe('Test Integración Users', function () {
    before(function () {
        // mongoose.connection.collections.users_test.drop();
    });
    beforeEach(function () {
        // this.timeout = 3000;
    });
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

    it('POST /api/auth/sessionlogin debe ingresar correctamente al usuario', async function () {
        const result  = await requester.post('/api/auth/sessionlogin').send({email: 'jcembalo@gmail.com', password: 'abc123'});

        expect(result).to.be.ok;
    });
});