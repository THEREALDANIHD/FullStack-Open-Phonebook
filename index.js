require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

morgan.token('body', request => {
    return JSON.stringify(request.body)
})

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: "1"
    },
    { 
        name: "Ada Lovelace", 
        number: "39-44-5323523",
        id: "2"
    },
    { 
        name: "Dan Abramov", 
        number: "12-43-234345",
        id: "3"
    },
    { 
        name: "Mary Poppendieck", 
        number: "39-23-6423122",
        id: "4"
    }
  ]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person)
    })
})

app.get('/info', (request, response) => {
    response.send(`<div>
                        <p>Phonebook has info for ${persons.length} people</p>
                        <p>${Date()}</p>
                    </div>`)
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number) {
        return response.status(300).json({
            error: "name or number missing"
        })
    }
    
    const names = persons.map(p => p.name)
    if(names.includes(body.name)) {
        return response.status(300).json({
            error: "name must be unique"
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: String(Math.floor(Math.random() * 100000))
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})