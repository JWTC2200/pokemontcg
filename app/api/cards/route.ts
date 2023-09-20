import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'
import { headers } from "next/headers"

export const GET = async (request: Request) => {
    const headersList = headers()
    const queryString = (headersList.get("query"))
    console.log(queryString)

    try {
        // const res = await PokemonTCG.Card.where({ q: `${name} ${mark} legalities.standard:legal`})
        const res = await PokemonTCG.findCardsByQueries({ q: `${queryString} legalities.standard:legal` })
        if(!res) return new Response("Card not found", {status: 404})
        return new Response(JSON.stringify(res), {status: 201})
    } catch (error) {
        console.log(error)
    }
}