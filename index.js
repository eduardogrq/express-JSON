
const { response, json } = require('express');
const express = require('express')
const server = express()

const fs = require('fs');
const { request } = require('http');
const { stringify } = require('querystring');

//Middleware
server.use(express.json())

function getKodersFile(){
    const content = fs.readFileSync('koders.json', 'utf8')
    return(JSON.parse(content))
}

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

// Agregaremos un koder a nuestro arreglo de koders

server.post('/koders', (request, response) => {
    const name = request.body.name
    const gender = request.body.gender

    const newKoder = {name, gender}

    const content = fs.readFileSync('koders.json', 'utf8')
    const json = JSON.parse(content)

    json.koders.push(newKoder)

    fs.writeFileSync('koders.json', JSON.stringify(json, null, 2), 'utf8')

    response.json({
        success: true
    })

})

// Actualizamos un koder de nuestro arreglo
server.patch('/koders/:id', (request, response) => {
    const id = parseInt(request.params.id) //string
    const name = request.body.name

    const kodersJSON = getKodersFile()

    const newKoders = kodersJSON.koders.reduce((koders, koderActual) => {
        if(id === koderActual.id){
            koderActual.name = name
        }

        return[
            ...koders,
            koderActual
        ]
    }, [])

    kodersJSON.koders = newKoders

    fs.writeFileSync('koders.json', JSON.stringify(kodersJSON, null, 2), 'utf8')

    response.json({
        success: true
    })
})

// Practica
/* 
Crear un endpoint para borrar
DELETE /koders/:id
GET /koders/:id
*/

//Obteniendo el koder
server.get('/koders/:id', (request, response) => {
    const id = parseInt(request.params.id)

    const kodersJSON = getKodersFile()

    let newKoder = kodersJSON.koders.find(koder => koder.id === id)

    if(!newKoder){
        response.json({
            // response.status(404),
            success: false,
            message: 'Koder not found'
        })
    }

    response.json({
        success: true,
        message: 'koder Found',
        data:{
            koder: newKoder
        }
    })
})

// Eliminar koders

server.delete('/koders/:id', (request, response) => {
    const id = parseInt(request.params.id)

    const kodersJSON = getKodersFile()

    const newKoders = kodersJSON.koders.filter(koder => koder.id != id)
    kodersJSON.koders = newKoders

    fs.writeFileSync('koders.json', JSON.stringify(kodersJSON, null, 2), 'utf8')

    response.json({
        success: true
    })
})

// Servidor escuchando
server.listen(8080, () => {
    console.log('Servidor escuchando en el puerto 8080')
})