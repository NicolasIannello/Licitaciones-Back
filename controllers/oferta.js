const { response }=require('express');
const Vehiculo=require('../models/vehiculo');
const Oferta=require('../models/oferta');
const Vista = require('../models/vista');

const getOfertas= async(req,res = response) =>{
    const matricula=req.query.matricula;
    const user=req.query.user;

    if(user==undefined){
        const ofertasDB= await Oferta.find({ 'matricula': { $eq: matricula } },).sort({ oferta: -1 });
        let cantidad= ofertasDB.length;

        res.json({
            ok:true,
            ofertasDB,
            cantidad,
        })
    }else{
        const ofertasDB= await Oferta.find({ 'user': { $eq: user } },).sort({ oferta: -1 });
        let cantidad= ofertasDB.length;

        res.json({
            ok:true,
            ofertasDB,
            cantidad,
        })
    }
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

const marcarOferta= async(req,res = response) =>{
    const {user,matricula}=req.body;
    
    try {
        const existeVista= await Vista.findOne({ $and: [ { 'matricula': { $eq: matricula } }, { 'user': { $eq: user } } ] });
        
        if(!existeVista){
            const vista = new Vista(req.body)
            await vista.save();     
        }     

        res.json({
            ok:true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
        });
    }
};

module.exports={getOfertas, crearOferta, marcarOferta}