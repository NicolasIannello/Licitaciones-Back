const path=require('path');
const fs=require('fs');
const { response } = require("express");
const { v4: uuidv4 }=require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");

const fileUpload= (req,res=response)=>{
    const tipo=req.params.tipo;
    const id=req.params.id;
    
    const tiposValidos=['hospitales','usuarios','medicos'];
    if( !tiposValidos.includes(tipo)){
        return res.status(400).json({
            ok:false,
            msg:'tipo no valido'
        })
    }

    if(!req.files || Object.keys(req.files).length===0){
        return res.status(400).json({
            ok:false,
            msg:'no se subieron archivos'
        })
    }

    const file=req.files.imagen;
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
    const path= './uploads/'+tipo+'/'+nombreArchivo;

    file.mv(path, (err)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                msg:'error en carga de img',
            })
        }

        actualizarImagen(tipo,id,nombreArchivo);

        res.json({
            ok:true,
            nombreArchivo
        })
    })
}

const retornaImagen= (req,res=response)=>{
    const tipo=req.params.tipo;
    const foto=req.params.foto;

    const pathImg= path.join( __dirname, '../uploads/'+tipo+'/'+foto);
    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        const pathImg= path.join( __dirname, '../uploads/no-img.jpg');
        res.sendFile(pathImg);
    }
    
}

module.exports={fileUpload,retornaImagen}