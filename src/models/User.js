const mongoose = require ('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema ({
    name: { type: String, required: true },
    email: {type: String, required: true},
    password: {type: String, required: true },
    date: {type: Date, default: Date.now }
});

UserSchema.methods.encryptPassword =  async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

UserSchema.methods.matchPassword = async function (password) {        // no se usa la funcion flecha por que se quiere hacer referencia a un dato propio, y las funciones flechas son anonimos 
    return await bcrypt.compare(password, this.password);         // para poder hacer uso de la palabra this no se puede usar funcion flecha
}


module.exports = mongoose.model('User', UserSchema);