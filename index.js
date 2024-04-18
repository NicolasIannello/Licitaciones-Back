const express =require('express');
require('dotenv').config();
const cors=require('cors');
const {dbConnection} = require('./database/config');

const app=express();

app.use(cors());

app.use( express.json() );

dbConnection();

app.use('/api/vehiculos', require('./routes/vehiculos'));
app.use('/api/imgs', require('./routes/imgs'));
app.use('/api/ofertas', require('./routes/ofertas'));
app.use('/api/usuarios', require('./routes/usuarios'));

app.listen( process.env.PORT, () =>{
    console.log('Iniciando');
});