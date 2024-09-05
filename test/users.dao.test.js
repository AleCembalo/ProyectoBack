import * as chai from 'chai';
import mongoose from 'mongoose';
import UsersService from "../src/dao/mongo/users.dao.mdb.js";

const connection  = await mongoose.connect('mongodb+srv://CoderBack:coderback2024@clustercoder.7swfcjo.mongodb.net/ecommerce');
const dao = new UsersService();
const expect = chai.expect;
const cartId = new mongoose.Types.ObjectId();
const testUser = { firstName: 'Juana', lastName: 'Cembalo', email: 'jj@gmail.com', age: 30, role: 'premium', password: 'abc123', cartId: cartId };

describe('Test DAO Users', function () {

    before(function () {});
    beforeEach(function () {});
    after(function () {});
    afterEach(function () {});

    it('get() debe retornar un array de usuarios', async function () {
        const result = await dao.getService();
        
        expect(result).to.be.an('array');
    });

    it('add() debe retornar un objeto con los datos del nuevo usuario', async function () {
        const result = await dao.addService(testUser);
        
        expect(result).to.be.an('object');
        expect(result._id).to.be.not.null;
    });

    it('getBy() debe retornar un objeto coincidente con el criterio indicado', async function () {
        const result = await dao.getOneService({ email: testUser.email });
        testUser._id = result._id;

        expect(result).to.be.an('object');
        expect(result._id).to.be.not.null;
        expect(result.email).to.be.equal(testUser.email);
    });

    it('update() debe retornar un objeto con los datos modificados', async function () {
        const modifiedMail = 'juani@juana.com';
        const result = await dao.updateService(testUser._id, { email: modifiedMail }, { new: true });

        expect(result).to.be.an('object');
        expect(result._id).to.be.not.null;
        expect(result.email).to.be.equal(modifiedMail);
    });

    it('delete() debe borrar definitivamente el documento indicado', async function () {
        const result = await dao.deleteService(testUser._id);

        expect(result).to.be.an('object');
        expect(result._id).to.be.deep.equal(testUser._id);
    });
});