const path = require('path')
const fs = require ('fs')

const express = require('express');
const fileUpload = require('express-fileupload');
let app = express();

const Usuario = require('../models/usuarios');
const Product = require('../models/products')


// default options
app.use(fileUpload({ useTempFiles : true}));

// subir archivos en products or usuarios 
app.put('/upload/:type/:id', (req, res)=>{

    let type = req.params.type
    let id = req.params.id

    if (Object.keys(req.files).length == 0) {
        return res.status(400)
            .json({
                 ok: false, 
                 err:{ message: 'No files were uploaded.' }
            });
    
    }

    let types = ['products', 'users']

    if(types.indexOf(type) < 0){
        return res.status(400).json({
            ok: false, 
            err: { message: `los tipos permitidos son ${types.join(', ')}`
            }, 
            
        }); 
    }

    let file = req.files.archivo;
    let nameExtension = file.name.split('.');
    let extension = nameExtension[nameExtension.length -1];
    
    let extensions = ['jpg', 'png', 'gif', 'jpeg'];

    if(extensions.indexOf(extension) < 0){
        return res.status(400).json({
            ok: false, 
            err: { message: `las extensiones permitidas son ${extensions.join(', ')}`,
                   extension
            }, 
            
        }); 
    }

    let newName = `${id}-${new Date().getMilliseconds()}.${extension}`

    file.mv(`uploads/${type}/${newName}`, (err) => {
        if (err)
          return res.status(500).json({
              ok: false, 
              err
          });
        
        if (type === 'users')
            setImageUser(id, res, newName)
        else 
            setImageProduct(id, res, newName)
      
    });
})

function setImageProduct(id, res, nameImg){
    Product.findById(id, (err, product)=>{
        if (err){
            deleteImg('products', nameImg)
            return res.status(500).json({
                ok: false, 
                err
            });
        }

        if(!product) {
            deleteImg('products', nameImg)
            return res.status(400).json({
                ok: false, 
                err: { message: 'No existe el usuario'}
            });
        }

        deleteImg('products', product.img)

        product.img = nameImg

        product.save((err, productDB)=>{
            if (err)
            return res.status(500).json({
                ok: false, 
                err
            });

            return res.json({
                ok: true, 
                product: product, 
                img: nameImg
            });

        })

    })
}
function setImageUser(id, res, nameImg){

    Usuario.findById(id, (err, user)=>{
        if (err){
            deleteImg('users', nameImg)
            return res.status(500).json({
                ok: false, 
                err
            });
        }
            
        if(!user) {
            deleteImg('users', nameImg)
            return res.status(400).json({
                ok: false, 
                err: { message: 'No existe el usuario'}
            });
        }

        deleteImg('users', user.img)

        user.img = nameImg;

        user.save((err, userBD )=>{
            if (err)
            return res.status(500).json({
                ok: false, 
                err
            });


            return res.json({
                ok: true, 
                user: user, 
                img: nameImg
            });

        })

    })
}

function deleteImg(type, name){
    
    let pathImage = path.resolve(__dirname, `../../uploads/${ type }/${ name }`)

    if(fs.existsSync(pathImage)){
        fs.unlinkSync(pathImage)
    }

}

module.exports = app

