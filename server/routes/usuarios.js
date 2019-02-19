const express = require('express');

const _ = require('underscore')
const bcrypt = require('bcrypt');

const Usuario = require('../models/usuarios');
const { verificateToken, verificateRol } = require('../middlewares/autentication')

const app = express();

app.get('/usuario', verificateToken , (req, res) => {
    let from = req.query.from || 0;
    from = Number(from)

    let limit = req.query.limit || 5;
    limit = Number(limit)

    Usuario.find({status: true}, 'img name email status role google')
        .skip(from)
        .limit(limit)
        .exec((err, usuarios)=>{
            if(err){
                return res.status(400).json(
                    {ok: false,
                     err
                    })
            }

            Usuario.count({status: true}, (err, total)=>{
                
                res.status(400).json(
                {ok: true,
                 usuarios, 
                 total
                })
            })
            


        })
})
  
  app.post('/usuario', [verificateToken, verificateRol],(req, res)=>{
      let body = req.body

      let usuario = Usuario({
          name: body.name,
          email: body.email,
          password: bcrypt.hashSync( body.password, 10),
          role: body.role
      })

      usuario.save((err, usuarioDB)=>{
            if(err){
                return res.status(400).json(
                    {ok: false,
                     err
                    })
            }

            res.status(400).json(
                {ok: true,
                 usuario: usuarioDB
                })
      })
  
  })
  
  app.put('/usuario/:id',  [verificateToken, verificateRol], (req, res) => {
      let id = req.params.id;
      let body = _.pick(req.body, ['name', 'email','img' ,'rol', 'status']);
      Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true} , (err, usuarioDB)=>{

        if(err){
            return res.status(400).json(
                {ok: false,
                 err
                })
        }

        res.json({
            ok: true, 
            usuario: usuarioDB
        })

      })
      
     
  })
  
  app.delete('/usuario/:id', [verificateToken, verificateRol] ,(req, res) =>{
      let id = req.params.id

      Usuario.findByIdAndUpdate(id, { status: false }, { new: true} , (err, usuarioDB)=>{

        if(err){
            return res.status(400).json(
                {ok: false,
                 err
                })
        }

        res.json({
            ok: true, 
            usuario: usuarioDB
        })

      })

    //Elimina fisicamente de la BD
    //   Usuario.findByIdAndDelete(id, (err, usuarioDelete)=>{
    //     if(err){
    //         return res.status(400).json(
    //             {ok: false,
    //              err
    //             })
    //     }

    //     if(!usuarioDelete){
    //         return res.status(400).json(
    //             {ok: false,
    //              error: {
    //                  message: "Usuario no encontrado"
    //              }
    //             })
    //     }
        
    //     res.json(
    //         {
    //             ok: true, 
    //             usuario: usuarioDelete
    //         }
    //     )
    //   })
  })

  module.exports = app;
  