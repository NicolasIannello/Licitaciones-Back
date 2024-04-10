const { Router }=require('express');
const { check }=require('express-validator');
const { getVehiculo, crearVehiculo, borrarVehiculo } = require('../controllers/vehiculo');
const { validarCampos } = require('../middlewares/validar-campos');

const router=Router();

router.get('/',getVehiculo);

router.post('/', [
    check('matricula','el campo es obligatorio').not().isEmpty(),
    check('matricula').isLicensePlate('any'),
    check('descripcion','el campo es obligatorio').not().isEmpty(),
    check('fecha').isDate(),
    validarCampos
],crearVehiculo);

router.delete('/', [
    check('vid','hubo un error al eliminar').isMongoId(),
    validarCampos
],borrarVehiculo);

router.post('/elim', [
    check('vid','hubo un error al eliminar').isMongoId(),
    validarCampos
],borrarVehiculo);

module.exports=router;