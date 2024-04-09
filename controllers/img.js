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

    const file=[];
    const nombreCortado=[];
    const extensionArchivo=[];
    const nombreArchivo=[];
    const path=[];
    const mat=req.body.matricula;
    const datos=[];
    const cantidad=req.files.img.length

    for (let i = 0; i < cantidad; i++) {
        file[i]=req.files.img[i];
        nombreCortado[i]=file[i].name.split('.');
        extensionArchivo[i]=nombreCortado[i][nombreCortado[i].length-1];

        const extensionesValidas=['png','jpg','jpeg','gif'];
        if(!extensionesValidas.includes(extensionArchivo[i])){
            return res.status(400).json({
                ok:false,
                msg:'extension mala (archivo: '+nombreCortado[i]+')',
            })
        }

        nombreArchivo[i]= uuidv4()+'.'+extensionArchivo[i];
        path[i]= './uploads/vehiculos/'+nombreArchivo[i];
        datos[i]={ matricula: mat, img: nombreArchivo[i] };

        file[i].mv(path[i], (err)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    msg:'error en carga de imagen (archivo: '+nombreCortado[i]+')',
                })
            }

            actualizarImagen(datos[i])
        })
    };

    
    res.json({
        ok:true,
        mat,
        nombreArchivo,
        cantidad,
    })
};

module.exports={getImagen, subirImagen}