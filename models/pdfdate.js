const { Schema, model } = require('mongoose');

const PDFdateSchema = Schema({
    month: { type: String, require:true },
});

PDFdateSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    return object;
});

module.exports= model('PDFdate',PDFdateSchema);