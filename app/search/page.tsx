"use client"

import React, { useState } from 'react'
import { TCardData, TQuery } from '../types/types'


const Search = () => {
    const [searching, setSearching] = useState(false)
    const [cardData, setCardData] = useState<TCardData>([])
    const [searchQuery, setSearchQuery] = useState<TQuery>({
        name: "",
        mark: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery((prev) => {
            return (
                {...prev, [e.target.id]: e.target.value}
            )
        })
    }

    const handleSubmit = async (e: React.SyntheticEvent) => { 
        e.preventDefault()
        setSearching(true)
        try {
            const res = await fetch(`api/cards?name=hiho`, {
                headers: {
                    name: searchQuery.name,
                    mark: searchQuery.mark                   
                }
            })
            const data = await res.json()
            console.log(data)
            setCardData(data)
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
                        onChange={(e)=>handleChange(e)}
                        value={searchQuery.name}
                    />
                </div>
                <div>
                    <label htmlFor="mark">Regulation mark: </label>
                    <input 
                        id="mark" 
                        placeholder='Regulation mark'
                        onChange={(e)=>handleChange(e)}
                        value={searchQuery.mark}
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