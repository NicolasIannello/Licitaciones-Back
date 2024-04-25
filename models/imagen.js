const { Schema, model } = require('mongoose');

const ImagenSchema = Schema({
    //matricula: { type: Schema.Types.ObjectId, require:true ,ref: 'Vehiculo' },
    matricula: { type: String, require:true},
    img: { type: String, require:true, /*unique:true*/ }
});

ImagenSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    return object;
});

module.exports= model('Imagen',ImagenSchema);