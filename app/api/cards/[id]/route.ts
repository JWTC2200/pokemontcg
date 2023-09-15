import pokemon from 'pokemontcgsdk'

pokemon.configure({apiKey: process.env.POKEMONAPI_KEY})

export const GET = async (request, {params}) => { 
    try {
        const res = await pokemon.card.where({ q: `name:${params.id} legalities.standard:legal`})
        if(!res) return new Response("Card not found", {status: 404})
        return new Response(JSON.stringify(res), {status: 201})
    } catch (error) {
        console.log(error)
    } 

    
}