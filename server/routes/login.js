const express = require('express');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuarios');

const app = express();

app.post('/login', (req, res)=>{
    
    let body = req.body;
    Usuario.findOne({email: body.email}, (err, usuarioDB)=>{
        if(err){
            return res.status(500).json(
                {ok: false,
                 err
                })
        }

        if(!usuarioDB){
            return res.status(400).json(
                {ok: false,
                 err: {
                     message: "Usuario* o contraseña incorrectos"
                 }
                })
        }

       if(!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json(
                {ok: false,
                err: {
                    message: "Usuario o contraseña* incorrectos"
                }
                })
       }

       let token = jwt.sign({
           usuario: usuarioDB
       }, process.env.SEED , {expiresIn: process.env.END_TOKEN})
       res.json({
        ok: true, 
        usuario: usuarioDB, 
        token
        })

    })
  
})

//Configuracion de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    return {
        name: payload.name, 
        email: payload.email, 
        img: payload.picture, 
        google: true
    }
  }

app.post('/google', async (req, res)=>{

    let token = req.body.idtoken;
    let google = await verify(token)
        .catch(err=>{
            return res.status(403).json({
                ok: false, 
                err
            })
        })
    
        Usuario.findOne({email: google.email }, (err, usuarioDB)=>{

            if(err){
                return res.status(500).json(
                    {ok: false,
                     err
                    })
            }

            if(usuarioDB){

                if(!usuarioDB.google){
                    return res.status(400).json({
                        ok: false, 
                        err: { message: "Por favor utilice la autenticación normal"}
                    })
                }else {

                    let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEED , {expiresIn: process.env.END_TOKEN})
                    res.json({
                     ok: true, 
                     usuario: usuarioDB, 
                     token
                     })

                }

            }else {
                //Si el usuario no existe en la BD

                let usuario = new Usuario();

                usuario.name = google.name, 
                usuario.email = google.email, 
                usuario.img = google.img, 
                usuario.google = true, 
                usuario.password = ':)'

                usuario.save((err, usuarioDB)=>{
                    if(err){
                        return res.status(500).json(
                            {ok: false,
                             err
                            })
                    }

                    let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEED , {expiresIn: process.env.END_TOKEN})
                    res.json({
                     ok: true, 
                     usuario: usuarioDB, 
                     token
                     })
                }) 
            }
        })
})

module.exports = app;