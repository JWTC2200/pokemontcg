"use client"

import React, { useState } from 'react'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'
import { TCardData, TQuery } from '../types/types'
import Card from '../../components/Card'


const Search = () => {
    const [searching, setSearching] = useState(false)
    const [cardData, setCardData] = useState<[PokemonTCG.Card]|[]>([])
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
            <Card
                key={card.id}
                {...card}
            />
        )
    })


    return (
        <section className="page_container">
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
            <section className='flex flex-wrap gap-4 justify-center'>
                {dataEl}
            </section>
        </section>
    )
}

export default Search