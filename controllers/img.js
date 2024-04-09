const path=require('path');
const fs=require('fs');
const { v4: uuidv4 }=require('uuid');
const { response }=require('express');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const getImagen= async(req,res = response) =>{
    const img=req.params.img;

    const pathImg= path.join( __dirname, '../uploads/vehiculo/'+img);
    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        const pathImg= path.join( __dirname, '../uploads/no-img.jpg');
        res.sendFile(pathImg);
    }
};

const subirImagen= async(req,res = response) =>{
    if(!req.files || Object.keys(req.files).length===0){
        return res.status(400).json({
            ok:false,
            msg:'no se subieron archivos'
        })
    }

    const file=req.files.img;
    const nombreCortado=file.name.split('.');
    const extensionArchivo= nombreCortado[nombreCortado.length-1];

    const extensionesValidas=['png','jpg','jpeg','gif'];
    if(!extensionesValidas.includes(extensionArchivo)){
        return res.status(400).json({
            ok:false,
            msg:'extension mala',
        })
    }

    const nombreArchivo= uuidv4()+'.'+extensionArchivo;
    const path= './uploads/vehiculos/'+nombreArchivo;
    const mat=req.body.matricula;
    const datos = { matricula: mat, img: nombreArchivo };

    file.mv(path, (err)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                msg:'error en carga de img',
            })
        }

        actualizarImagen(datos)

        res.json({
            ok:true,
            mat,
            nombreArchivo
        })
    })
};

module.exports={getImagen, subirImagen}