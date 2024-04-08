const Usuario=require('../models/usuario');
const bcrypt=require('bcryptjs');
const { response }=require('express');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios= async(req,res) =>{
    const desde= req.query.desde || 0;

    const [ usuarios, total ]= await Promise.all([
        Usuario.find({},'nombre email role img').skip(desde).limit(5),
        Usuario.count()
    ]); 

    res.json({
        ok:true,
        usuarios,
        total,
        uid:req.uid
    });
};

const crearUsuario=async(req,res=response) =>{
    const {email,password}=req.body;

    try {
        const existeEmail= await Usuario.findOne({email});
        if(existeEmail){
            return res.status(400).json({
                ok:false,
                msg:'ya existe el mail'
            });
        }

        const usuario= new Usuario(req.body);

        const salt=bcrypt.genSaltSync();
        usuario.password=bcrypt.hashSync(password,salt);

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

const actualizarUsuario= async(req,res=response)=>{
    const uid=req.params.id;

    try {
        const usuarioDB= await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'no existe ese usuario id'
            });
        }

        const {password, google, email, ...campos}=req.body;
        if(usuarioDB.email!==email){
            const existeEmail= await Usuario.findOne({ email });
            if(existeEmail){
                return res.status(400).json({
                    ok: false,
                    msg:' ya existe usuario con ese email'
                })
            }
        }
        campos.email=email;

        const usuarioActualizado= await Usuario.findByIdAndUpdate(uid, campos,{new:true});

         res.json({
                ok:true,
                usuario: usuarioActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'error'
        });
    }
}

const borrarUsuario= async(req,res=response)=>{
    const uid=req.params.id;

    try {
        const usuarioDB= await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'no existe ese usuario id'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        return res.json({
            ok:true,
            msg:'usuario eliminado'
        });   
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'error'
        });
    }
};

module.exports={getUsuarios,crearUsuario,actualizarUsuario,borrarUsuario}