const express = require('express')

const Product = require('../models/products');
const { verificateToken } = require('../middlewares/autentication')

let app = express()

//Obtener todos los productos
app.get('/product', verificateToken , (req, res)=>{
     
    let from = req.query.from || 0;
    from = Number(from)

    let limit = req.query.limit || 5;
    limit = Number(limit)

    let query = {
        available: true
    }

    Product.find(query)
        .populate('category','name')
        .populate('user', 'name email')
        .skip(from)
        .limit(limit)
        .exec((err, products)=>{
            if(err){
                return res.status(500).json(
                    {ok: false,
                     err
                    })
            }

            if(!products){
                return res.status(400).json(
                    {ok: false,
                     err: { message:"No hay registros"}
                    })
            }

            Product.count(query).exec((err, total)=>{
                if(err){
                    return res.status(500).json(
                        {ok: false,
                         err
                        })
                }

                res.json({
                    ok: true, 
                    products, 
                    total
                })

            })
 
        })
})

//Obtener producto por id
app.get('/product/:id', verificateToken, (req, res)=>{
   
    let id = req.params.id

    Product.findById(id)
    .populate('category', 'name')
    .populate('user', 'name email')
    .exec(
        (err, product)=>{
            if(err){
                return res.status(500).json(
                    {ok: false,
                     err
                    })
            }
    
            if(!product){
                return res.status(400).json(
                    {ok: false,
                     err: { message:"No se pudo encontrar el producto"}
                    })
            }
    
            res.json({
                ok: true, 
                product
            })
        }
    )

})

//Buscar 

app.get('/product/search/:query', verificateToken, (req, res)=>{

    let query = req.params.query

    let regex = new RegExp(query, 'i')

    Product.find({name: regex})
        .populate('category', 'name')
        .populate('user', 'name email')
        .exec((err, products)=>{
            if(err){
                return res.status(500).json(
                    {ok: false,
                     err
                    })
            }

            if(!products){
                return res.status(400).json(
                    {ok: false,
                     err: { message:"No se pudo encontraron el productos"}
                    })
            }

            res.json({
                ok: true, 
                products
            })

        })

})

//Crear un nuevo producto
app.post('/product', verificateToken, (req, res)=>{
     
    let body = req.body;
    let product = new Product({
        name: body.name, 
        priceUni: body.priceUni, 
        description: body.description, 
        category: body.category, 
        user: req.usuario._id
    })

    product.save((err, product)=>{
        if(err){
            return res.status(500).json(
                {ok: false,
                 err
                })
        }

        if(!product){
            return res.status(400).json(
                {ok: false,
                 err: { message:"No se pudo almacenar el producto"}
                })
        }

        res.status(201).json({
            ok: true, 
            product
        })
    })

})

//Actualizar un nuevo producto
app.put('/product/:id', verificateToken, (req, res)=>{
    //usuario
    //categoria 
    let id = req.params.id;
    let body = req.body;
    let updateP = {
        name: body.name, 
        description: body.description,
        priceUni: body.priceUni, 
        category: body.category, 
        user: req.usuario._id, 
        available: body.available
    }

    Product.findByIdAndUpdate(id, updateP, {new: true , runValidators: true },  (err, product)=>{
        if(err){
            return res.status(500).json(
                {ok: false,
                 err
                })
        }

        if(!product){
            return res.status(400).json(
                {ok: false,
                 err: { message:"No se pudo actualizar el producto"}
                })
        }

        res.json({
            ok: true, 
            product
        })
    })
  
})

//Eliminar un nuevo producto no de forma fisica
app.delete('/product/:id', verificateToken, (req, res)=>{
    
    let id = req.params.id

    updateP = {
        available: false
    }
    Product.findByIdAndUpdate(id, updateP, {new: true , runValidators: true },  (err, product)=>{
        if(err){
            return res.status(500).json(
                {ok: false,
                 err
                })
        }

        if(!product){
            return res.status(400).json(
                {ok: false,
                 err: { message:"No se pudo actualizar el producto"}
                })
        }

        res.json({
            ok: true, 
            product
        })
    })
})



module.exports = app;