const { Router }=require('express');
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario }=require('../controllers/usuarios');
const { check }=require('express-validator');
const { validarCampos }=require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router=Router();

router.get('/', validarJWT, getUsuarios );

router.post('/',[  
    check('nombre').not().isEmpty(),
    check('password').not().isEmpty(),
    check('email').isEmail(),
    validarCampos
],crearUsuario );

router.put('/:id',[
    validarJWT,
    check('nombre','el campo es obligatorio').not().isEmpty(),
    check('role','el campo es obligatorio').not().isEmpty(),
    check('email').isEmail(),
    validarCampos
], actualizarUsuario );

router.delete('/:id', validarJWT, borrarUsuario);

module.exports=router;