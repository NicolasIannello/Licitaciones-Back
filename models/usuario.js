const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    user: { type: String, required: true, unique:true },
    mail: { type: String, required: true },
    tel: { type: String, required: true },
    nomapel: { type: String, required: true },
    pass: { type: String, required: true },
    grupo: { type: String}
});

UsuarioSchema.method('toJSON', function() {
    const { __v, _id,pass, ...object } = this.toObject();
    object.vid= _id;
    return object;
});

module.exports= model('Usuario',UsuarioSchema);