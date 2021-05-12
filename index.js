
const { response } = require('express');
const express = require('express')
const server = express()

const fs = require('fs')

//Middleware
server.use(express.json())

//creamos la ruta de koders
server.get('/koders', (request, response) => {
    // Leemos los datos que tenemos en koders.json, a través de fs
    fs.promises.readFile('koders.json', "utf8")
        .then((data) => {
            // Parseamos los datos para imprimirlos como json, y saber que va a recibir lo mismo con .json
            response.json(JSON.parse(data))
        })
        .catch((error) => {
            response.write('Ocurrió un error: ', error)
            response.end()
        })
})

server.listen(8080, () => {
    console.log('Servidor escuchando en el puerto 8080')
})