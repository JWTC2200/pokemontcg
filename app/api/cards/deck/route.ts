import { NextRequest } from "next/server";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

export const GET = async (req: NextRequest) => {
    let params: any = {}
    for (const [key, val] of req.nextUrl.searchParams) { 
        params[key] = val 
    } 

    const name = params.name ? `name:"${params.name}*"` : "" 
    const superType = params.supertype ? `supertype:"${params.supertype}"` : ""
    const setname = params.setname ? `set.name:"${params.setname}"` :""
    const format = params.format ? `legalities.${params.format}:legal` : ""

    try {
        const res = await PokemonTCG.findCardsByQueries({ q: `${name} ${superType} ${setname} ${format}`})
        if(!res) return new Response("Card not found", {status: 404})
        return new Response(JSON.stringify(res), {status: 201})
        
    } catch (error) {
        console.log(error)
    }

}