const { Router, application }=require('express');
const expressFileUpload =require('express-fileupload');
const { fileUpload, retornaImagen } = require('../controllers/upload');
const { validarJWT } = require('../middlewares/validar-jwt');

const router=Router();

router.use(expressFileUpload());

router.put('/:tipo/:id', validarJWT, fileUpload );

router.get('/:tipo/:foto', retornaImagen );


module.exports=router;