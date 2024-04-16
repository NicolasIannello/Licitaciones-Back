const { Router }=require('express');
const { check }=require('express-validator');
const { getVehiculo, crearVehiculo, borrarVehiculo, getPDF, borrarVehiculoDate } = require('../controllers/vehiculo');
const { validarCampos } = require('../middlewares/validar-campos');

const router=Router();

router.get('/',getVehiculo);

router.post('/', [
    check('matricula','el campo es obligatorio').not().isEmpty(),
    check('matricula').isLicensePlate('any'),
    check('descripcion','el campo es obligatorio').not().isEmpty(),
    check('date').isDate(),
    check('fecha','el campo es obligatorio').not().isEmpty(),
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

router.delete('/date', [
    check('date').isDate(),
    validarCampos
],borrarVehiculoDate);

router.get('/pdf',getPDF);

module.exports=router;