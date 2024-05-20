const { borrarImagen } = require('../helpers/actualizar-imagen');
const Imagen = require('../models/imagen');
const Vehiculo=require('../models/vehiculo');
const Oferta=require('../models/oferta');
const Vista = require('../models/vista');
const { response }=require('express');
const nodemailer = require("nodemailer");
const Usuario = require('../models/usuario');

const getVehiculo= async(req,res = response) =>{
    const desde= req.query.desde || 0;
    const limit= req.query.limit || 25;
    const user= req.query.user;
    const grupo=req.query.grupo
    let vehiculos=null,total=null;

    let tresMeses = new Date();
    tresMeses.setMonth(tresMeses.getMonth() - 3);
    const vehiculoViejos= await Vehiculo.find({ 'date': { $lt: tresMeses } },);
    if(vehiculoViejos){
        for (let i = 0; i < vehiculoViejos.length; i++) {
            await Imagen.deleteMany({ 'matricula': { $eq: vehiculoViejos[i].matricula } },)
            await Oferta.deleteMany({ 'matricula': { $eq: vehiculoViejos[i].matricula } },)
            await Vista.deleteMany({ 'matricula': { $eq: vehiculoViejos[i].matricula } },);
            await Vehiculo.deleteMany({ 'matricula': { $eq: vehiculoViejos[i].matricula } },)                
        }
    }

    if(grupo!=undefined && grupo!="general"){
        [ vehiculos, total ]= await Promise.all([
            Vehiculo.find({ $or: [ { 'grupo': { $eq: grupo } }, { 'grupo': { $eq: 'general' } } ] }).skip(desde).limit(limit).sort({ date: -1 }),
            //Vehiculo.find({ 'grupo': { $eq: grupo } },).skip(desde).limit(limit).sort({ date: -1 }),
            Vehiculo.countDocuments()
        ]);
    }else{
        [ vehiculos, total ]= await Promise.all([
            Vehiculo.find().skip(desde).limit(limit).sort({ date: -1 }),
            Vehiculo.countDocuments()
        ]);
    }

    if(user!="null" && user!=undefined){
        for (let i = 0; i < vehiculos.length; i++) {
            let tipo=0;

            const existeOferta= await Oferta.findOne({ $and: [ { 'matricula': { $eq: vehiculos[i].matricula } }, { 'user': { $eq: user } } ] });
            if(existeOferta){
                tipo=2;
            }else{
                const existeVista= await Vista.findOne({ $and: [ { 'matricula': { $eq: vehiculos[i].matricula } }, { 'user': { $eq: user } } ] });
                if(existeVista) tipo=1;
            }

            vehiculos[i]={
                _id:vehiculos[i]._id,
                matricula:vehiculos[i].matricula,
                descripcion:vehiculos[i].descripcion,
                date:vehiculos[i].date,
                fecha:vehiculos[i].fecha,
                grupo:vehiculos[i].grupo,
                __v:vehiculos[i].__v,
                tipo: tipo 
            };
        }
    }

    res.json({
        ok:true,
        vehiculos,
        total,
    });

};

const crearVehiculo= async(req,res = response) =>{
    const {matricula, descripcion}=req.body;

    try {
        const existeMatricula= await Vehiculo.findOne({matricula});
        if(existeMatricula){
            return res.status(400).json({
                ok:false,
                msg:'ya existe un vehiculo con la misma matricula'
            });
        }

        const vehiculo = new Vehiculo(req.body);
        await vehiculo.save();

        res.json({
            ok:true,
            vehiculo,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'error'
        });
    }
};

const borrarVehiculo= async(req,res=response)=>{
    const {vid}=req.body;

    try {
        const vehiculoDB= await Vehiculo.findById(vid);
        const imagenesDB= await Imagen.find({ 'matricula': { $eq: vehiculoDB.matricula } },);
        const ofertasDB= await Oferta.find({ 'matricula': { $eq: vehiculoDB.matricula } },);
        let cantidad= imagenesDB.length;
        let cantidadOferta= ofertasDB.length;

        if(!vehiculoDB){
            return res.status(404).json({
                ok:false,
                msg:'no existe ese vehiculo'
            });
        }

        // let pathViejo='';
        // for (let i = 0; i < cantidad; i++) {
        //     pathViejo='./uploads/vehiculos/'+imagenesDB[i].img
        //     borrarImagen(pathViejo);
        // }
        
        await Imagen.deleteMany({ 'matricula': { $eq: vehiculoDB.matricula } },)
        await Oferta.deleteMany({ 'matricula': { $eq: vehiculoDB.matricula } },)
        await Vista.deleteMany({ 'matricula': { $eq: vehiculoDB.matricula } },)

        await Vehiculo.findByIdAndDelete(vid);

        return res.json({
            ok:true,
            msg:'vehiculo eliminado',
            fotos:cantidad,
            ofertas:cantidadOferta,
        });   
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'error'
        });
    }
};

const getPDF= async(req,res = response)=>{
    const vehiculosDB= await Oferta.find().skip(0).sort({ matricula: -1 });
    let vehiculos=[], j=0, ofertas=[];

    for (let i = 0; i < vehiculosDB.length; i++) {
        if(vehiculos[j]==undefined) vehiculos.push({ matricula:vehiculosDB[i].matricula, ofertas:undefined })
        
        if(vehiculos[j].matricula==vehiculosDB[i].matricula){
            ofertas.push({ user:vehiculosDB[i].user, oferta:vehiculosDB[i].oferta })
        }else{
            vehiculos[j].ofertas=ofertas;
            ofertas=[];
            ofertas.push({ user:vehiculosDB[i].user, oferta:vehiculosDB[i].oferta })
        }

        if(vehiculos[j]!=undefined && vehiculos[j].matricula!=vehiculosDB[i].matricula) {
            vehiculos.push({ matricula:vehiculosDB[i].matricula, ofertas:undefined })
            j++;
        }
        if(i==vehiculosDB.length-1) {
            vehiculos[j].ofertas=ofertas;
            vehiculos[j].ofertas.sort(function(a, b) {
                return parseFloat(b.oferta) - parseFloat(a.oferta);
            });
        }
    }

    res.json({
        ok:true,
        vehiculos
    });
};

const borrarVehiculoDate= async(req,res=response)=>{
    const {date}=req.body;

    try {
        const vehiculoDB= await Vehiculo.find({ 'date': { $lt: date } },);        
        let cantidadV= vehiculoDB.length;
        let cantidadI=0;
        let cantidadO=0;

        if(!vehiculoDB){
            return res.status(404).json({
                ok:false,
                msg:'no existe ese vehiculo'
            });
        }

        for (let i = 0; i <= cantidadV; i++) {
            if(i==cantidadV){
                return res.json({
                    ok:true,
                    msg:'vehiculo eliminado',
                    vehiculo: cantidadV,
                    fotos:cantidadI,
                    ofertas:cantidadO,
                });   
            }
            const imagenesDB= await Imagen.find({ 'matricula': { $eq: vehiculoDB[i].matricula } },);
            const ofertasDB= await Oferta.find({ 'matricula': { $eq: vehiculoDB[i].matricula } },);       
            cantidadI+=imagenesDB.length; cantidadO+=ofertasDB.length;

            // let pathViejo='';
            // for (let i = 0; i < imagenesDB.length; i++) {
            //     pathViejo='./uploads/vehiculos/'+imagenesDB[i].img
            //     borrarImagen(pathViejo);
            // }
            
            await Imagen.deleteMany({ 'matricula': { $eq: vehiculoDB[i].matricula } },)
            await Oferta.deleteMany({ 'matricula': { $eq: vehiculoDB[i].matricula } },)
            await Vista.deleteMany({ 'matricula': { $eq: vehiculoDB[i].matricula } },);

            await Vehiculo.deleteMany({ 'matricula': { $eq: vehiculoDB[i].matricula } },)
        }

        return res.json({
            ok:true,
            msg:'error inesperado',
        });   
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'error'
        });
    }


};

const notificar= async(req,res=response)=>{
    const {cantidad}=req.body;

    const users = await Usuario.find();
    const transporter = nodemailer.createTransport({
        maxConnections: 1,
        pool: true,
        service: process.env.MSERVICE,
        auth: {
            user: process.env.MAIL,
            pass: process.env.MPASS
        }
    });

    users.forEach(async user=>{
        await transporter.sendMail({
            from: '"Licitaciones" <'+process.env.MAIL+'>',
            to: user.mail,
            subject: "Nuevos vehiculos",
            text: "Se cargaron nuevos vehiculos",//"Se cargaron "+cantidad+" nuevos vehiculos",
            html: "<b>Se cargaron nuevos vehiculos</b><br>Puede verlos siguiendo el link: "+process.env.LINK,//"<b>Se cargaron "+cantidad+" nuevos vehiculos</b><br>Puede verlos siguiendo el link: "+process.env.LINK,
        }, function(error, info){
            if (error) {
                console.log(error);
            }
        });
    });

    return res.json({
        ok:true,
        msg:'Email sent',
    });  
};

module.exports={getVehiculo,crearVehiculo,borrarVehiculo,getPDF,borrarVehiculoDate, notificar}