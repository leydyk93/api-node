
const jwt = require('jsonwebtoken');

//========================
// verifica el token del usuario
//========================
let verificateToken = (req, res, next) =>{

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decode)=>{
        if(err){
            return res.status(401).json({
                ok: false, 
                err: { message: "Token no válido"}
            })
        }

        req.usuario = decode.usuario;
        next();
    })
    
}

//========================
// verifica el rol administrador del usuario
//========================

let verificateRol = (req, res, next) =>{

    let usuario =  req.usuario;
    if(usuario.role !== 'ADMIN_ROLE'){       
        return res.json({
            ok: false, 
            err: { message: "No tiene el rol adecuado para realizar la operación"}
        })   
    }else 
        next();
    
}

module.exports = {
    verificateToken, 
    verificateRol
}