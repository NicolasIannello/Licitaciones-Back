const { response }=require('express');
const usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const login=async(req,res=response)=>{
    const { email, password }= req.body;

    try {
        const usuarioDB= await usuario.findOne({ email });
        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'no mail'
            })
        }

        const validPassword=bcrypt.compareSync(password,usuarioDB.password);
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'mal password'
            })
        }

        const token= await generarJWT(usuarioDB.id);

        res.json({
            ok:true,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'error login'
        });
    }
}

const renewToken= async(req,res=response)=>{
    const uid =req.uid;

    const token= await generarJWT(uid);
    const usuarioDB= await usuario.findById(uid)

    res.json({
        ok:true,
        token,
        usuarioDB
    })
}

module.exports={login,renewToken};