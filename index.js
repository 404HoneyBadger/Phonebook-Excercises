const express = require('express')// handles all the requests but no logging
const app = express()
var morgan = require('morgan') //morgan logs all the requests and response codes by default, can do more like log the content of the response but need add-ons.
var middle = morgan(':method :url :status :res[content-length] - :response-time ms :bodbabe') //replace ('tiny') with the acutal tiny output and add :bodbabe to call the custom token I made below

morgan.token('bodbabe', function (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body); //this is the custom token we created to add to 'middle' when it gets called
  } else {
    return null;
  }
});

app.use(morgan(':bodbabe'))// this is the last token on 'var middle', the token itself has an if/else statement about the conditions it needs to execute inside the assigned 'middle' format
app.use(middle)// this is the assigned default format we created for all requests(GET, POST, PUT, DELETE), the last token 'bodbabe' will execute only if the parameters in the if/else statemnt is satisfied (HAS TO BE  REQ.POST)
app.use(morgan('tiny'))// this is a default in morgan's library, we dont use it for this excersice, but we did copy the exact tokens and just added 'bodbabe'

app.use(express.json())//

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
      if(-1 != check) { //-1 means no match (for findIndex()) so OPPOSITE (!=) MEANS MATCH and match spits out error
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
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