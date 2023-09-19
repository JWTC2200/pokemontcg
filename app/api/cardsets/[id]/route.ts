import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'

export const GET = async (req:Request, {params}: {params:{id:string}}) => {
    try {
        const res = await PokemonTCG.findCardsByQueries({q: `set.id:${params.id}`})
        if(!res) return new Response("Card not found", {status: 404})
        return new Response(JSON.stringify(res), {status: 201})
    } catch (error) {
        console.log(error)
    }

}

