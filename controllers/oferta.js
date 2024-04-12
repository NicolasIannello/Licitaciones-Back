const { response }=require('express');
const Vehiculo=require('../models/vehiculo');
const Oferta=require('../models/oferta');

const getOfertas= async(req,res = response) =>{
    // const matricula=req.query.matricula;

    // const imagenesDB= await Imagen.find({ 'matricula': { $eq: matricula } },);
    // let cantidad= imagenesDB.length;
    
    // res.json({
    //     ok:true,
    //     file,
    //     cantidad,
    // })
};

const crearOferta= async(req,res = response) =>{
    const {matricula}=req.body;
    try {
        const existeMatricula= await Vehiculo.findOne({matricula});
        if(!existeMatricula){
            return res.status(400).json({
                ok:false,
                msg:'error al crear oferta'
            });
        }

        const oferta = new Oferta(req.body);
        await oferta.save();

        res.json({
            ok:true,
            oferta,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'error'
        });
    }
};

module.exports={getOfertas, crearOferta}