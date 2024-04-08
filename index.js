const express =require('express');
require('dotenv').config();
const cors=require('cors');
const {dbConnection} = require('./database/config');

const app=express();

app.use(cors());

app.use( express.json() );

dbConnection();

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/todo', require('./routes/todo'));
app.use('/api/upload', require('./routes/upload'));

app.listen( process.env.PORT, () =>{
    console.log('Iniciando');
});