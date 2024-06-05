const { Router }=require('express');
const { check }=require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearUsuario, login, renewToken, getUser, actualizarUsuario } = require('../controllers/usuario');
const { validarJWT } = require('../middlewares/validar-jwt');

const router=Router();

router.get('/', getUser);

router.post('/actualizar',[
    check('id','error').not().isEmpty(),
    validarCampos
], actualizarUsuario)

router.post('/crear', [
    check('tel','numero no valido').isMobilePhone(),
    check('mail').isEmail(),
    check('user','el campo es obligatorio').not().isEmpty(),
    check('pass','el campo es obligatorio').not().isEmpty(),
    check('nomapel','el campo es obligatorio').not().isEmpty(),
    validarCampos
],crearUsuario);

router.post('/login', [
    check('mail').isEmail(),
    check('pass','el campo es obligatorio').not().isEmpty(),
    validarCampos
],login);

router.get('/renew', /*validarJWT,*/ renewToken);

module.exports=router;