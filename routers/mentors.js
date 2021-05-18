const express = require('express')
const router = express.Router()
const fs = require('fs');
const { request } = require('http');
const { stringify } = require('querystring');

//Función para obtener toda 
function getMentorsFile(){
    const content = fs.readFileSync('koders.json', 'utf8')
    return(JSON.parse(content))
}

router.get('/', async(request, response) => {

    let jsonParsed = getMentorsFile()
    let mentorsData = null

    jsonParsed.mentors = mentorsData || jsonParsed.mentors
    response.json(jsonParsed.mentors)
})

router.post('/', (request, response) => {
    const id = request.body.id
    const name = request.body.name
    const module = request.body.module

    const newMentor = {id, name, module}

    const content = fs.readFileSync('koders.json', 'utf8')
    const json = JSON.parse(content)

    json.mentors.push(newMentor)

    fs.writeFileSync('koders.json', JSON.stringify(json, null, 2), 'utf8')

    response.json({
        success: true
    })

})

// Actualizamos un mentor de nuestro arreglo
router.patch('/:id', (request, response) => {
    const id = parseInt(request.params.id) //string
    const name = request.body.name
    const module = request.body.module

    const mentorsJSON = getMentorsFile()

    const newMentors = mentorsJSON.mentors.reduce((mentors, mentorActual) => {
        if(id === mentorActual.id){
            mentorActual.name = name,
            mentorActual.module = module
        }

        return[
            ...mentors,
            mentorActual
        ]
    }, [])

    mentorsJSON.mentors = newMentors

    fs.writeFileSync('koders.json', JSON.stringify(mentorsJSON, null, 2), 'utf8')

    response.json({
        success: true
    })
})

//Obteniendo el mentor
router.get('/:id', (request, response) => {
    const id = parseInt(request.params.id)

    const mentorsJSON = getMentorsFile()

    let newMentor = mentorsJSON.mentors.find(mentor => mentor.id === id)

    if(!newMentor){
        response.json({
            // response.status(404),
            success: false,
            message: 'Mentor not found'
        })
    }

    response.json({
        success: true,
        message: 'Mentor Found',
        data:{
            mentor: newMentor
        }
    })
})

// Eliminar mentores

router.delete('/:id', (request, response) => {
    const id = parseInt(request.params.id)

    const mentorsJSON = getMentorsFile()

    const newMentor = mentorsJSON.mentors.filter(mentor => mentor.id != id)
    mentorsJSON.mentors = newMentor

    fs.writeFileSync('koders.json', JSON.stringify(mentorsJSON, null, 2), 'utf8')

    response.json({
        success: true
    })
})

module.exports = router