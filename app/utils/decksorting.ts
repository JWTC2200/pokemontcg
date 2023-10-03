import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

const sortByCardNumber = (deck:Array<PokemonTCG.Card>) => {
    return deck.sort((a,b)=>{
        return Number(a.number) - Number(b.number)
    })
}

const sortByRelease = (deck:Array<PokemonTCG.Card>) => {
    return deck.sort((a,b)=>{
        return Number(new Date(b.set.releaseDate)) - Number(new Date(a.set.releaseDate))
    })
}

const sortByName = (deck:Array<PokemonTCG.Card>) => {
    return deck.sort((a,b)=> {
        const nameA = a.name.toUpperCase()
        const nameB = b.name.toUpperCase()
        if( nameA < nameB) {
            return -1
        }
        if( nameA > nameB) {
            return 1
        }
        return 0
    })        
}

export const deckSorting = (deck:Array<PokemonTCG.Card> | []) => {
    const Pokemon = deck.filter(card => card.supertype === "Pokémon")
    const Trainers = deck.filter(card => card.supertype === "Trainer")
    const Energy = deck.filter(card => card.supertype === "Energy")
    
    const sortedPokemon = sortByRelease(sortByCardNumber(Pokemon)).sort((a,b)=>{
        return Number(a.nationalPokedexNumbers![0]) - Number(b.nationalPokedexNumbers![0])
    })

    const sortedTrainers = sortByName(sortByRelease(sortByCardNumber(Trainers)))

    const sortedEnergy = sortByName(sortByRelease(sortByCardNumber(Energy)))
    
    return {
        sortedPokemon: sortedPokemon,
        sortedTrainers: sortedTrainers,
        sortedEnergy: sortedEnergy,
    }
}