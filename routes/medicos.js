const { Router }=require('express');
const { check }=require('express-validator');
const { validarCampos }=require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const {getMedicos,crearMedicos,actualizarMedicos,borrarMedicos}=require('../controllers/medicos');

const router=Router();

router.get('/', getMedicos );

router.post('/',[  
    validarJWT,
    check('nombre').not().isEmpty(),
    check('hospital').isMongoId(),
    validarCampos
],crearMedicos );

router.put('/:id',[
    validarJWT,
    check('nombre').not().isEmpty(),
    check('hospital').isMongoId(),
    validarCampos
], actualizarMedicos );

router.delete('/:id', borrarMedicos);

module.exports=router;