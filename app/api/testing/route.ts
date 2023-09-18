import pokemon from 'pokemontcgsdk'

pokemon.configure({apiKey: process.env.POKEMONAPI_KEY})

export const GET = async (request: Request) => {

    try {
        console.log(1)
        const res = await pokemon.set.all()
        if(!res) return new Response("Card not found", {status: 404})
        return new Response(JSON.stringify(res), {status: 201})
    } catch (error) {
        console.log(error)
    }
}