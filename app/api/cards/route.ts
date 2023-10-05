import { NextRequest } from 'next/server'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'


export const GET = async (req:NextRequest) => {
    let params: any = {}
    for (const [key, val] of req.nextUrl.searchParams) { 
        params[key] = val 
    }

    const name = params.name ? `name:"${params.name}*"` : ""
    const regMark = params.regulationMark ? `regulationMark:"${params.regulationMark}"` : ""
    const subTypes = params.subtypes ? `subtypes:"${params.subtypes}"` : ""
    const rarity = params.rarity ? `rarity:"${params.rarity}"` : ""
    const superType = params.supertype ? `supertype:"${params.supertype}"` : ""
    const types = params.types ? `types:"${params.types}"` : ""
    const series = params.series ? `set.series:"${params.series}"` : ""
    const setname = params.setname ? `set.name:"${params.setname}"` :""

    try {
        const res = await PokemonTCG.findCardsByQueries({ q: `${name} ${regMark} ${subTypes} ${rarity} ${superType} ${types} ${series} ${setname}`})
        if(!res) return new Response("Card not found", {status: 404})
        return new Response(JSON.stringify(res), {status: 201})
    } catch (error) {
        console.log(error)
    }
}