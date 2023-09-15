import pokemon from 'pokemontcgsdk'

pokemon.configure({apiKey: process.env.POKEMONAPI_KEY})

export const findCard = async () => {
    pokemon.card.where({ q: 'legalities.standard:legal name:blastoise', })
        .then(result => {
            console.log(result.data) // "Blastoise"
        })
    }