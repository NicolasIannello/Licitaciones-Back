const { response }=require('express');
const Medico=require('../models/medicos');

const getMedicos=async(req,res=response)=>{
    const medicos= await Medico.find().populate('usuario','nombre img').populate('hospital','nombre img');

    res.json({
        ok:true,
        medicos
    });
}

const crearMedicos=async(req,res=response)=>{
    const uid=req.uid;
    const medico= new Medico({ usuario: uid, ...req.body });

    try {
        const medicoDB= await medico.save();

        res.json({
            ok:true,
            medicoDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:true,
            msg:'error crearhmedico'
        });
    }
}

const actualizarMedicos=async(req,res=response)=>{
    const id=req.params.id;
    const uid=req.uid;
    try {
        const medico=await Medico.findById(id);
        if(!medico){
            return res.status(404).json({
                ok:true,
                msg:'no actmedico'
            });
        }

        const cambiosMedico={ ...req.body, usuario:uid };

        const medicoActualizado= await Medico.findByIdAndUpdate(id, cambiosMedico, {new:true});

        res.json({
            ok:true,
            medicoActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:true,
            msg:'error actmedico'
        });
    }
}
const borrarMedicos=async(req,res=response)=>{
    const id=req.params.id;
    try {
        const medico=await Medico.findById(id);
        if(!medico){
            return res.status(404).json({
                ok:true,
                msg:'no borrmedico'
            });
        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok:true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:true,
            msg:'error borrmedico'
        });
    }
}

module.exports={getMedicos,crearMedicos,actualizarMedicos,borrarMedicos};