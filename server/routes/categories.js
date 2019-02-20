const express = require('express');

const Category = require('../models/categories');

let { verificateToken, verificateRol } = require('../middlewares/autentication')

const app = express();

// listar todas las categorias
app.get('/category', verificateToken, (req, res)=>{
    Category.find({})
    .sort('name')
    .populate('user', 'name email')
    .exec((err, categories)=>{
        
            if(err){
                return res.status(400).json(
                    {ok: false,
                        err
                    })
            }
    
            if(!categories){
                return res.status(400).json(
                    {ok: false,
                     err
                    })
             }
    
            res.json({
                ok: true, 
                category: categories
            })
    
        })
    
})

// solo una categoria la indicada en el id
app.get('/category/:id', verificateToken, (req, res)=>{

   let id = req.params.id;
   Category.findById(id).exec((err, category)=>{
        if(err){
            return res.status(400).json(
                {ok: false,
                    err
                })
        }

        if(!category){
            return res.status(400).json(
                {ok: false,
                 err
                })
         }

        res.json({
            ok: true, 
            category: category
        })

   })

})

// Crear una nueva categoria verificateToken
app.post('/category', verificateToken , (req, res)=>{
    
    let body = req.body
    
    let category = new Category({
        name: body.name,
        user: req.usuario._id
    })

    category.save((err, category)=>{
        if(err){
            return res.status(500).json(
                {ok: false,
                    err
                })
         }

         if(!category){
            return res.status(400).json(
                {ok: false,
                    err
                })
         }

         res.json({
            ok: true, 
            category: category
        })

    })
       
})

// Actualizar el nombre de una categoria 
app.put('/category/:id', verificateToken, (req, res)=>{
    
    let id = req.params.id;
    let body = req.body;

    let uptadteCategory = {
        name: body.name
    }

    Category.findByIdAndUpdate(id, uptadteCategory, { new: true, runValidators: true}, (err, category)=>{
        if(err){
            return res.status(400).json(
                {ok: false,
                    err
                })
         }

         res.json({
            ok: true, 
            category: category
        })
    })
    
})

// Eliminar de forma fisica 
app.delete('/category/:id',[verificateToken, verificateRol], (req, res)=>{
  
    let id = req.params.id;
    Category.findByIdAndRemove(id, (err, category)=>{
        if(err){
            return res.status(500).json(
                {ok: false,
                    err
                })
         }

         if(!category){
            return res.status(400).json(
                {ok: false,
                    err: { message: "El id no existe"}
                })
         }

         res.json({
            ok: true, 
            category: category
        })
    })
   
})


module.exports = app;