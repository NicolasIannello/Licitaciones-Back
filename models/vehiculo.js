const { Schema, model } = require('mongoose');

const VehiculoSchema = Schema({
    matricula: { type: String, required: true, unique:true },
    descripcion: { type: String, required: true },
    date: { type: Date, required: true },
    fecha: { type: String, required: true },
    grupo: { type: String }
});

VehiculoSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.vid= _id;
    return object;
});

module.exports= model('Vehiculo',VehiculoSchema);