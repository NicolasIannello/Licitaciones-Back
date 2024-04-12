const { Schema, model } = require('mongoose');

const OfertaSchema = Schema({
    // matricula: { type: Schema.Types.ObjectId, require:true ,ref: 'Vehiculo' },
    matricula: { type: String, require:true},
    oferta: { type: Number, required:true },
    contacto: { type: String, require:true },
});

OfertaSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    return object;
});

module.exports= model('Oferta',OfertaSchema);