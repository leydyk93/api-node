const path = require('path')
const fs = require ('fs')

const express = require('express');

const {verificateToken, verificateTokenImg} = require('../middlewares/autentication')

let app = express();

app.get('/img/:type/:img', verificateTokenImg,  (req, res)=>{

    let type = req.params.type
    let img = req.params.img

    let pathImage = path.resolve(__dirname, `../../uploads/${ type }/${ img }`)

    if(fs.existsSync(pathImage)){
        res.sendFile(pathImage)
    }else{
        let noImage = path.resolve(__dirname, '../assets/img/no-image.jpg')
        res.sendFile(noImage)
    }

})

module.exports = app;