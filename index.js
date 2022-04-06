const express = require('express')
const app = express()

app.use(express.json())

let pBook = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456',
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523',
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345',
    },
    {
        id: 4,
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
    },
];

app.get('/api/persons', (request, response) => {
    response.json(pBook)
});

app.get('/info', (request, response) => {
    const info = pBook.length
    const now = new Date() // empty date means default which is timestamp
    response.send(`Phonebook has info for ${info} people<br> ${now} `)
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const singleE = pBook.find((singleE) => singleE.id === id);
  
    if (singleE) {
      response.json(singleE);
    } else {
      response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    pBook = pBook.filter(arr1 => arr1.id !== id)
    response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random()*1999)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
      }

      if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
      }

      const check = pBook.findIndex(dupName => dupName.name == body.name)
      if(body.name == check) {
        response.send({error:'name must be unique'})
      }

      

      const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
      
      }
    
      pBook = pBook.concat(person)
      response.json(person)
    })


   


const PORT = 3003 //bind the http server assigned to the app variable, to listen to HTTP requests sent to the port 3003:
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})