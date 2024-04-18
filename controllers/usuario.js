const { response }=require('express');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/usuario');
const bcrypt=require('bcryptjs');

const crearUsuario= async(req,res = response) =>{
    const {mail,pass,user}=req.body;

    try {
        const existeEmail= await Usuario.findOne({mail});
        if(existeEmail){
            return res.status(400).json({
                ok:false,
                msg:'Ya existe una cuenta con ese e-mail'
            });
        }
        const existeUser= await Usuario.findOne({pass});
        if(existeUser){
            return res.status(400).json({
                ok:false,
                msg:'Ya existe una cuenta con ese nombre de usuario'
            });
        }

        const usuario= new Usuario(req.body);

        const salt=bcrypt.genSaltSync();
        usuario.pass=bcrypt.hashSync(pass,salt);

        await usuario.save();
        const token= await generarJWT(usuario.uid);

        res.json({
            ok:true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'error'
        });
    }
};

const login=async(req,res=response)=>{
    const { mail, pass }= req.body;

    try {
        const usuarioDB= await Usuario.findOne({ mail });
        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'No se encontro un usuario con ese e-mail'
            })
        }

        const validPassword=bcrypt.compareSync(pass,usuarioDB.pass);
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'Contraseña incorrecta'
            })
        }

        const token= await generarJWT(usuarioDB.id);

        res.json({
            ok:true,
            token,
            user: usuarioDB.user
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
    const _id =req.header('_id');
    const token= await generarJWT(_id);
    const usuarioDB= await Usuario.find({ user: _id })

    res.json({
        ok:true,
        token,
        usuarioDB
    })
}

module.exports={crearUsuario,login,renewToken}