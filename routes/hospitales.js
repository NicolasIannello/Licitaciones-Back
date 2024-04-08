const { Router }=require('express');
const { check }=require('express-validator');
const { validarCampos }=require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const {getHospitales,crearHospitales,actualizarHospitales,borrarHospitales}=require('../controllers/hospitales');

const router=Router();

router.get('/', getHospitales );

router.post('/',[  
    validarJWT,
    check('nombre').not().isEmpty(),
    validarCampos
],crearHospitales );

router.put('/:id',[
    validarJWT,
    check('nombre').not().isEmpty(),
    validarCampos
], actualizarHospitales );

router.delete('/:id',validarJWT, borrarHospitales);

module.exports=router;