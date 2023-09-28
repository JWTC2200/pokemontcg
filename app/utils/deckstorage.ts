import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

const addToDeck = (card: PokemonTCG.Card) => {
    if (localStorage.currentDeck ) {
        console.log(card.subtypes)
        const currentCards = JSON.parse(localStorage.currentDeck)
        if (currentCards.length >= 60) {
            alert("deck full no more cards can be added")
        }
        if (card.supertype === ("Pokémon" || "trainer")) {
            const number = currentCards.filter((entry: PokemonTCG.Card) => entry.name === card.name).length
            if (number >= 4) {
                alert("limit reached")
                return
            }            
        }
        if ((card.supertype === "Energy") && (card.subtypes[0] != "Basic")) {
            const number = currentCards.filter((entry: PokemonTCG.Card) => entry.name === card.name).length
            if (number >= 4) {
                alert("limit reached")
                return
            }   
        }
        currentCards.push(card)
        localStorage.currentDeck = JSON.stringify(currentCards)
    } else {
        localStorage.currentDeck = JSON.stringify([card])
    }
    
}


export default addToDeck