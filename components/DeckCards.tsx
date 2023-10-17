import React from 'react'

type Tprops = {
    image: string,
    addCard: () => void
    removeCard: () => void
    viewOverlay: () => void
    inDeck: boolean
    number: number
}

const DeckCards = ({image, addCard, removeCard, viewOverlay, inDeck, number}: Tprops ) => {
  return (
    <div
        className='w-40 relative hover:scale-105 z-0'        
    >   
        { number 
            ? <div 
                className='absolute bottom-1/4 left-1/2 text-3xl font-bold text-red-700 -translate-x-1/2 stroke-black bg-white bg-opacity-75 w-12 h-12 rounded-full flex justify-center items-center'
            >
                x{number}
            </div>
            : null        }
        
        <img
            src={image}
            className='cursor-pointer card_outline '
            onClick={viewOverlay}
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