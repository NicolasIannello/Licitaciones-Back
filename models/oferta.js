const { Schema, model } = require('mongoose');

const OfertaSchema = Schema({
    matricula: { type: String, require:true},
    oferta: { type: Number, required:true },
    nomapel: { type: String, require:true },
    tel: { type: String, require:true },
    user: { type: String, require:true },
});

OfertaSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    return object;
});

module.exports= model('Oferta',OfertaSchema);