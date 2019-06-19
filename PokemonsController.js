const {
  connect
} = require('./PokemonsRepository')
const pokemonsModel = require('./PokemonsSchema')

connect() // para conectar no mongoDB

const limiteNivel = 150

const calcularNivel = (datas, pokemons) => {
  const diff = Math.abs(new Date(datas.dataInicio) - new Date(datas.dataFim)) / 3600000
  const resultado = pokemons.nivel + diff / 4

  if(resultado >= limiteNivel) {
    return limiteNivel
  } 

  return resultado
}

const getAll = () => {
  return pokemonsModel.find((error, pokemons) => {
    return pokemons
  })
}

const getById = (id) => {
  return pokemonsModel.findById(id)
}

const add = (pokemon) => {
  const novoPokemon = new pokemonsModel(pokemon)
  return novoPokemon.save()
}

const remove = (id) => {
  return pokemonsModel.findByIdAndDelete(id)
}

const update = (id, pokemon) => {
  return pokemonsModel.findByIdAndUpdate(
    id, {
      $set: pokemon
    }, {
      new: true
    },
  )
}

const treinar = async (id, datas) => {
  const pokemon = await pokemonsModel.findById(id)
  // let calculoNivel = calcularNivel(datas, pokemon) 

  // if (calculoNivel >= 150) {
  //   calculoNivel = 150
  // }

  return pokemonsModel.findByIdAndUpdate(
    id, {
      $set: {
        nivel: calcularNivel(datas, pokemon)
      }
    }, {
      new: true
    }
  )
}

module.exports = {
  getAll,
  getById,
  add,
  remove,
  update,
  treinar
}