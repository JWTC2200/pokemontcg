import React from 'react'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'

type Tprops = {
    image: string,
    editting: boolean,
    addCard: React.Dispatch<React.SetStateAction<any>>
    removeCard: React.Dispatch<React.SetStateAction<any>>
}

const DeckCards = ({image, editting, addCard, removeCard}: Tprops ) => {
  return (
    <div
        className='w-40'
    >
        <img
            src={image}
            className='cursor-pointer card_outline hover:scale-110'
        />
        <div className="flex justify-between px-3 pt-2 text-amber-100 text-sm">
            <div 
                onClick={addCard}
                className='cursor-pointer w-16 py-1 flex justify-center items-center rounded-md bg-green-700'
            >
                Add
            </div>
            <div 
                onClick={removeCard}
                className='cursor-pointer w-16 py-1 flex justify-center items-center rounded-md bg-red-500'
            >
                Remove
            </div>
        </div>

    </div>
  )
}

export default DeckCards