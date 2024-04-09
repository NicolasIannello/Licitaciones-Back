const fs=require('fs');
const Imagen = require('../models/imagen');

const borrarImagen= (path)=>{
    if(fs.existsSync(path)){
        fs.unlinkSync(path);
    }
}

const actualizarImagen= async(datos)=>{
    const imagen = new Imagen(datos)
    await imagen.save();
    
    return true;
}

module.exports={actualizarImagen, borrarImagen};