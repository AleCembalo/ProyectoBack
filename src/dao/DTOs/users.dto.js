import mongoose from 'mongoose';

class UsersDto {
    
    constructor(user) {
        this.user = user;
        this.firstName = user.firstName;
        this.lastName = user.lastName.toUpperCase();
        this.email = user.email;
        this.age = user.age;
        this.role = user.role;
        this.documents = user.documents;
        this.active = user.active;
        this.password = user.password;
        this.cartId = user.cartId instanceof mongoose.Types.ObjectId ? user.cartId : new mongoose.Types.ObjectId (user.cartId);
        this.last_connection = user.last_connection;
    }
}
    
export default UsersDto;