const { Schema, model } = require('mongoose');

const PDFSchema = Schema({
    matricula: { type: String, require:true},
    user: { type: String, require:true },
    oferta: { type: String, require:true }
});

PDFSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    return object;
});

module.exports= model('PDF',PDFSchema);