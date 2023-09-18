import pokemon from 'pokemontcgsdk'
import { headers } from "next/headers"

pokemon.configure({apiKey: process.env.POKEMONAPI_KEY})

export const GET = async (request: Request) => {
    const headersList = headers()
    const name = headersList.get("name") ? `name:${headersList.get("name")}` : ""
    const mark = headersList.get("mark") ? `regulationMark:${headersList.get("mark")}` : "" 

    try {
        const res = await pokemon.card.where({ q: `${name} ${mark} legalities.standard:legal`})
        if(!res) return new Response("Card not found", {status: 404})
        return new Response(JSON.stringify(res), {status: 201})
    } catch (error) {
        console.log(error)
    }
}