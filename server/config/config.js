//=======
//Puerto
//=======
process.env.PORT = process.env.PORT || 3000; 

//========
// Entorno
//========
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//========
// caducidad del token 
//========
process.env.END_TOKEN = 60 * 60 * 24 * 30;


//========
// SEDD JWT
//========
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//=======
// Base de Datos
//=======
let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
}else {
    urlDB = process.env.Mongo_URI
}

process.env.URLDB = urlDB;