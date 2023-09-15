"use client"

import React, { useEffect, useState } from 'react'
import { TCardData, TQuery } from '../types/types'


const Search = () => {
    const [searching, setSearching] = useState(false)
    const [cardData, setCardData] = useState<TCardData>([])
    const [searchQuery, SearchQuery] = useState<TQuery>({
        name: "",
        mark: "",
    })

    const handleSubmit = async (e: React.SyntheticEvent) => { 
        e.preventDefault()
        setSearching(true)
        try {
            const res = await fetch(`api/cards?name=hiho`, {
                headers: {
                    name: searchQuery.name                    
                }
            })
            const data = await res.json()
            setCardData(data.data)
        } catch (error) {
            console.log(error)
        }
        setSearching(false)
    }

    const dataEl = cardData.map(card => {
        return (
            <img 
                key={card.id}
                src={card.images.small}
            />
        )
    })

    return (
        <section className="w-full max-w-screen-2xl h-full bg-slate-500 bg-opacity-30 flex flex-col items-center pt-4 px-4">
            <form 
                className='text-black flex flex-col items-start'
                onSubmit={handleSubmit}
            >
                <div>
                    <label htmlFor="name">Name: </label>
                    <input 
                        id="name" 
                        placeholder='Card name'
                        onChange={(e)=>SearchQuery({...searchQuery, name:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="mark">Regulation mark: </label>
                    <input 
                        id="mark" 
                        placeholder='Regulation mark'
                        onChange={(e)=>SearchQuery({...searchQuery, mark:e.target.value})}
                    />
                </div>
                <button
                    type="submit"
                    className='self-center red_btn mt-2'
                    disabled={searching}
                >
                    Search
                </button>
            </form>
            <section className='flex flex-wrap gap-2 justify-center'>
                {dataEl}
            </section>
        </section>
    )
}

export default Search