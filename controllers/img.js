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
    let file= [];//

    if(cantidad==0){//
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
    }//
    res.json({
        ok:true,
        imagenesDB,
        cantidad,
    })
};

const getSingleImagen= async(req,res = response) =>{
    const img=req.query.img;
    const imagenesDB= await Imagen.find({ 'img': { $eq: img } },);
    let pathImg;

    if(imagenesDB.length>0){
        pathImg=pathImg= path.join( __dirname, '../uploads/vehiculos/'+imagenesDB[0].img);
    }else{
        pathImg=pathImg= path.join( __dirname, '../uploads/vehiculos/'+imagenesDB.img);
    }

    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        const pathImg= path.join( __dirname, '../uploads/no-img.jpg');
        res.sendFile(pathImg);
    }
};

const subirImagen= async(req,res = response) =>{
    if(!req.files || Object.keys(req.files).length===0){//
        return res.status(400).json({
            ok:false,
            msg:'no se subieron archivos'
        })
    }//

    const file=[];//
    const nombreCortado=[];
    const extensionArchivo=[];
    const nombreArchivo=[];
    const path=[];//
    const mat=req.body.matricula;
    const datos=[];
    //let cantidad=Array.isArray(req.body.img) ? req.body.img.length : 1;//req.body.img.length || 1;//req.files.img.length || 1;
    let cantidad=req.files.img.length || 1;//

    for (let i = 0; i < cantidad; i++) {//
        file[i]=req.files.img[i] ? req.files.img[i] : req.files.img;
        nombreCortado[i]=file[i].name.split('.');
        extensionArchivo[i]=nombreCortado[i][nombreCortado[i].length-1];

        const extensionesValidas=['png','jpg','jpeg','gif','pdf'];
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
                console.log(err);
                return res.status(500).json({
                    ok:false,
                    msg:'error en carga de imagen (archivo: '+nombreCortado[i]+')',
                })
            }

            actualizarImagen(datos[i])
        })
    };//
    // if(cantidad==1){
    //     datos[0]={ matricula: mat, img: req.body.img };
    //     actualizarImagen(datos[0])
    // }else{
    //     for (let i = 0; i < cantidad; i++) {
    //         datos[i]={ matricula: mat, img: req.body.img[i] };
    //         actualizarImagen(datos[i])
    //     }
    // }
    
    res.json({
        ok:true,
        mat,
        //nombreArchivo,
        cantidad,
    })
};

module.exports={getImagen, subirImagen, getSingleImagen}