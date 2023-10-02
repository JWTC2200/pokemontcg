import { PokemonTCG } from "pokemon-tcg-sdk-typescript"

export const addCardCheck = (deck: [] | Array<PokemonTCG.Card>, newCard: PokemonTCG.Card) => {
    if (deck.length >= 60) return {result: false, message:"Deck is full!"}
    const names = deck.map(card => card.name)
    if (newCard.supertype === "Pokémon") {
        const cardsInDeck = names.filter(card => card === newCard.name)
        if (cardsInDeck.length >= 4) return {result:false, message: "Max copies"}        
    } 
    if (newCard.supertype === "Trainer") {
        const cardsInDeck = names.filter(card => card === newCard.name)
        if (cardsInDeck.length >= 4) return {result:false, message: "Max copies"}         
    }
    if (newCard.supertype === "Energy") {
        if(newCard.subtypes) {
            if (newCard.subtypes[0] === "Special") {
                const cardsInDeck = names.filter(card => card === newCard.name)
                if (cardsInDeck.length >= 4) return {result:false, message: "Max copies"} 
            }
        }
    }
    
    return { result: true, message: ""}
}

