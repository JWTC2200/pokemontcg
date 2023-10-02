import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

export const deckSorting = (deck:Array<PokemonTCG.Card> | []) => {
    const Pokemon = deck.filter(card => card.supertype === "Pokémon")
    const Trainers = deck.filter(card => card.supertype === "Trainer")
    const Energy = deck.filter(card => card.supertype === "Energy")

    const sortingFunction = (deck:Array<PokemonTCG.Card>) => {
        const sortedDeck = deck.sort((a,b)=>{
            return Number(a.number) - Number(b.number)
        }).sort((a,b)=>{
            return Number(new Date(b.set.releaseDate)) - Number(new Date(a.set.releaseDate))
        })
        return sortedDeck
    }

    const sortingNameFunction = (deck:Array<PokemonTCG.Card>) => {
        const sortedDeck = deck.sort((a,b)=> {
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
        return sortedDeck
    }
    
    const sortedPokemon = sortingFunction(Pokemon).sort((a,b)=>{
        return Number(a.nationalPokedexNumbers![0]) - Number(b.nationalPokedexNumbers![0])
    })

    const sortedTrainers = sortingNameFunction(sortingFunction(Trainers))

    const sortedEnergy = sortingNameFunction(sortingFunction(Energy))
    
    return {
        sortedPokemon: sortedPokemon,
        sortedTrainers: sortedTrainers,
        sortedEnergy: sortedEnergy,
    }
}