const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const servidor = express()
const controller = require('./PokemonsController')
const params = require('params')
const parametrosPermitidos = require('./parametrosPermitidos')
const PORT = 3000

const logger = (request, response, next) => {
  console.log(`${new Date().toISOString()} Request type: ${request.method} to ${request.originalUrl}`)

  response.on('finish', () => {
    console.log(`${response.statusCode} ${response.statusMessage};`)
  })

  next()
}

servidor.use(cors())
servidor.use(bodyParser.json())
servidor.use(logger)

servidor.get('/', (request, response) => {
  response.send('Olá, mundo!')
})

servidor.get('/pokemons', async (request, response) => {
  controller.getAll()
    .then(pokemons => response.send(pokemons))
})

servidor.get('/pokemons/:pokemonId', (request, response) => {
  const pokemonId = request.params.pokemonId
  controller.getById(pokemonId)
    .then(pokemon => {
      if (!pokemon) {
        response.sendStatus(404)
      } else {
        response.send(pokemon)
      }
    })
    .catch(error => {
      if (error.name === "CastError") {
        response.sendStatus(400)
      } else {
        response.sendStatus(500)
      }
    })
})

servidor.delete('/pokemons/:id', (request, response) => {
  controller.remove(request.params.id)
    .then(resultado => {
      if (!resultado) {
        response.send(404)
      } else {
        response.send(204)
      }
    })
    .catch(error => {
      response.send(500)
    })
})

servidor.patch('/pokemons/:id', (request, response) => {
  controller.update(request.params.id, params(request.body).only(parametrosPermitidos.update))
    .then(pokemon => {
      if (!pokemon) {
        response.sendStatus(404)
      } else {
        response.send(pokemon)
      }
    })
    .catch(error => {
      if (error.name === "MongoError" || error.name === "CastError") {
        response.sendStatus(400)
      } else {
        response.sendStatus(500)
      }
    })
})

servidor.patch('/pokemons/treinar/:id', (request, response) => {
  controller.treinar(request.params.id, params(request.body).only(parametrosPermitidos.treinar))
    .then(pokemon => {
      if (!pokemon) {
        response.sendStatus(404)
      } else {
        response.send(pokemon)
      }
    })
    .catch(error => {
      if (error.name === "MongoError" || error.name === "CastError") {
        response.sendStatus(400)
      }
      //  else if("forte"){
      //   response.send("Seu pokemon é muito forte")
      // }
      else {
        response.sendStatus(500)
      }
    })
})

servidor.post('/pokemons', (request, response) => {
  controller.add(params(request.body).only(parametrosPermitidos.add))
    .then(pokemon => {
      const _id = pokemon._id
      response.send(_id)
    })
    .catch(error => {
      if (error.name === "ValidationError") {
        response.sendStatus(400)
      } else {
        response.sendStatus(500)
      }
    })
})


servidor.listen(PORT)
console.info(`Rodando na porta ${PORT}`)