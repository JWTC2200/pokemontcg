import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

export const deckSorting = (deck:[PokemonTCG.Card] | []) => {
    const Pokemon = deck.filter(card => card.supertype === "Pokémon")
    const Trainers = deck.filter(card => card.supertype === "Trainer")
    const Energy = deck.filter(card => card.supertype === "Energy")

    
    const sortedPokemon = Pokemon.sort((a,b)=>{
        return Number(new Date(b.set.releaseDate)) - Number(new Date(a.set.releaseDate))
    }).sort((a,b)=>{
        return Number(a.nationalPokedexNumbers![0]) - Number(b.nationalPokedexNumbers![0])
    })

    const sortedTrainers = Trainers.sort((a,b)=>{
        return Number(new Date(b.set.releaseDate)) - Number(new Date(a.set.releaseDate))
    }).sort((a,b)=> {
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

    const sortedEnergy = Energy.sort((a,b)=>{
        return Number(new Date(b.set.releaseDate)) - Number(new Date(a.set.releaseDate))
    }).sort((a,b)=> {
        const nameA = a.subtypes[0].toUpperCase()
        const nameB = b.subtypes[0].toUpperCase()
        if( nameA < nameB) {
            return -1
        }
        if( nameA > nameB) {
            return 1
        }
        return 0
    }).sort((a,b)=> {
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
    
    return {
        sortedPokemon: sortedPokemon,
        sortedTrainers: sortedTrainers,
        sortedEnergy: sortedEnergy,
    }
}