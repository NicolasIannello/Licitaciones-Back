const { Schema, model } = require('mongoose');

const VistaSchema = Schema({
    matricula: { type: String, require:true},
    user: { type: String, require:true },
});

VistaSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    return object;
});

module.exports= model('Vista',VistaSchema);