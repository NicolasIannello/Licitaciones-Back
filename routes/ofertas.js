const { Router }=require('express');
const { check }=require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { getOfertas, crearOferta } = require('../controllers/oferta');

const router=Router();

router.get('/',[
    check('matricula').isLicensePlate('any'),
], getOfertas);

router.post('/', [
    check('oferta','el campo es obligatorio').not().isEmpty(),
    check('matricula').isLicensePlate('any'),
    check('contacto','el campo es obligatorio').not().isEmpty(),
    validarCampos
],crearOferta);

module.exports=router;