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
process.env.END_TOKEN = '48h';

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


//=======
// ClienteID de google 
//=======

 process.env.CLIENT_ID = process.env.CLIENT_ID || '1034100030075-c2fdebo91tnqoh6e94tmus9f328b8c3u.apps.googleusercontent.com';