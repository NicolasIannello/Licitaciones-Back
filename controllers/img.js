const path=require('path');
const fs=require('fs');
const { v4: uuidv4 }=require('uuid');
const { response }=require('express');
const { actualizarImagen } = require('../helpers/actualizar-imagen');
const Imagen = require('../models/imagen');

const getImagen= async(req,res = response) =>{
    const matricula=req.query.matricula;

    const imagenesDB= await Imagen.find({ 'matricula': { $eq: matricula } },);
    let cantidad= imagenesDB.length;
    let file= [];

    if(cantidad==0){
        const pathImg= path.join( __dirname, '../uploads/no-img.jpg');
        file[0]=null;
    }else{
        for (let i = 0; i < cantidad; i++) {
            const pathImg= path.join( __dirname, '../uploads/vehiculos/'+imagenesDB[i].img);
            if(fs.existsSync(pathImg)){
                file[i]=imagenesDB[i].img;
            }else{
                const pathImg= path.join( __dirname, '../uploads/no-img.jpg');
                file[i]=null;
            }  
        }
    }
    res.json({
        ok:true,
        file,
        cantidad,
    })
};

const getSingleImagen= async(req,res = response) =>{
    const img=req.query.img;
    const imagenesDB= await Imagen.find({ 'img': { $eq: img } },);

    const pathImg= path.join( __dirname, '../uploads/vehiculos/'+imagenesDB[0].img);
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

module.exports={getImagen, subirImagen, getSingleImagen}