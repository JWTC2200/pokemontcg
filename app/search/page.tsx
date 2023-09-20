"use client"

import React, { useEffect, useState } from 'react'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'
import { useSearchParams, useRouter } from 'next/navigation'
import { TQuery } from '../types/types'
import Card from '../../components/Card'

const Search = () => {

    const params = new URLSearchParams()
    const router = useRouter()
    const searchParams = Array.from(useSearchParams().entries())
    const [hasSearched, setHasSearched] = useState(false)
    const [searching, setSearching] = useState(false)
    const [noQuery, setNoQuery] = useState(false)
    const [cardData, setCardData] = useState<[PokemonTCG.Card]|[]>([])
    const [searchQuery, setSearchQuery] = useState<TQuery>({
        name:"",
        regulationMark: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery((prev) => {
            return (
                {...prev, [e.target.name]: e.target.value}
            )
        })
    }


    const handleSubmit = (e:React.SyntheticEvent) => {
        e.preventDefault()
        handleParams()
        router.push(`/search?${params.toString()}`)
        const queryString:string = params.toString().replaceAll("=",":").replaceAll("&"," ")
        fetchCards(queryString)
    }

    // If already has search params e.g. from link, immediate search 
    useEffect(()=>{
        if (searchParams.length > 0 ) {
            searchParams.forEach(param => {
                setSearchQuery((prev) => {
                    return (
                        {...prev, [param[0]]: param[1]}
                    )
                })
            })
            let queryString:string = ""
            searchParams.forEach(param => queryString += `${param[0]}:${param[1]} `)
            fetchCards(queryString)
        } else {
            console.log(312)
        }
    }, [])

    const handleParams = ()=> {
        const keys = Object.keys(searchQuery) as Array<keyof typeof searchQuery>
        console.log(searchQuery)
        keys.forEach((key) => {
            if (searchQuery[key]) {
                params.set(key, searchQuery[key])
            }
        })
    }

    // fetch card data using params
    const fetchCards = async (queryString: string) => {    
            setNoQuery(false) 
            if(!queryString) {
                setNoQuery(true)
            } else {
                setHasSearched(true)
                setSearching(true)
                try {
                    const res = await fetch("api/cards", {
                        headers: {
                            query: queryString
                        }
                    })
                    const data = await res.json()
                    setCardData(data)
                } catch (error) {
                    console.log(error)
                }
                setSearching(false)
            }           
    }

    const dataEl = cardData.map(card => 
        <Card
            key={card.id}
            {...card}
        />
    )

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
                        name="name" 
                        placeholder='Card name'
                        onChange={(e)=>handleChange(e)}
                        value={searchQuery.name}
                    />
                </div>
                <div>
                    <label htmlFor="regulationMark">Regulation mark: </label>
                    <input 
                        id="regulationMark" 
                        name="regulationMark"
                        placeholder='Regulation mark'
                        onChange={(e)=>handleChange(e)}
                        value={searchQuery.regulationMark}
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
            {
                noQuery 
                ? <div>Please provide at least one search option</div>
                : null
            }
            <section className='flex flex-wrap gap-4 justify-center'>
                
                { hasSearched 
                    ?  searching 
                        ? <div>...loading</div>
                        : dataEl.length ? dataEl : <div>No results</div>
                    : null               
                }
                
            </section>
        </section>
    )
}

export default Search