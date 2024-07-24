import mongoose from 'mongoose';
import { createHash } from '../../services/utils.js'

class UsersDto {
    
    constructor(user) {
        this.user = user;
        this.firstName = user.firstName;
        this.lastName = user.lastName.toUpperCase();
        this.email = user.email;
        this.age = user.age;
        this.password = createHash(user.password);
        this.role = user.role ? user.role : user;
        this.cartId = user.cartId instanceof mongoose.Types.ObjectId ? user.cartId : new mongoose.Types.ObjectId (user.cartId);
    }
}
    
export default UsersDto;