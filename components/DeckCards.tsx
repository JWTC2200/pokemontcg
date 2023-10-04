import React from 'react'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'

type Tprops = {
    image: string,
    addCard: () => void
    removeCard: () => void
    inDeck: boolean
}

const DeckCards = ({image, addCard, removeCard, inDeck}: Tprops ) => {
  return (
    <div
        className='w-40'
    >
        <img
            src={image}
            className='cursor-pointer card_outline hover:scale-105'
        />
        <div className="flex justify-center px-3 pt-2 text-amber-100 text-sm">
            {inDeck
                ? <div 
                    onClick={removeCard}
                    className='cursor-pointer w-16 py-1 flex justify-center items-center rounded-md bg-red-500'
                >
                    Remove
                </div>
                : <div 
                    onClick={addCard}
                    className='cursor-pointer w-16 py-1 flex justify-center items-center rounded-md bg-green-700'
                >
                    Add
                </div>
            }                      
        </div>
    </div>
  )
}

export default DeckCards