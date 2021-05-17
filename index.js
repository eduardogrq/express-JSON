
const { response, json } = require('express');
const express = require('express')
const server = express()

const kodersRouter = require('./routers/koders')

//Middleware
server.use(express.json())
server.use('/koders', kodersRouter)


// Servidor escuchando
server.listen(8080, () => {
    console.log('Servidor escuchando en el puerto 8080')
})