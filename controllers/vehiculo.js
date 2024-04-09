const Vehiculo=require('../models/vehiculo');
const { response }=require('express');

const getVehiculo= async(req,res = response) =>{
    const desde= req.query.desde || 0;

    const [ vehiculos, total ]= await Promise.all([
        Vehiculo.find().skip(desde).limit(5),
        Vehiculo.count()
    ]);

    res.json({
        ok:true,
        vehiculos,
        total
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
    //const vid=req.params.id;
    const {vid}=req.body;

    try {
        const vehiculoDB= await Vehiculo.findById(vid);

        if(!vehiculoDB){
            return res.status(404).json({
                ok:false,
                msg:'no existe ese vehiculo'
            });
        }

        await Vehiculo.findByIdAndDelete(vid);

        return res.json({
            ok:true,
            msg:'vehiculo eliminado'
        });   
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'error'
        });
    }
};

module.exports={getVehiculo,crearVehiculo,borrarVehiculo}