const { Router, application }=require('express');
const expressFileUpload =require('express-fileupload');
const { getImagen, subirImagen, getSingleImagen } = require('../controllers/img');

const router=Router();

router.use(expressFileUpload());

router.get('/',getImagen);

router.get('/single',getSingleImagen);

router.post('/', subirImagen);

module.exports=router;