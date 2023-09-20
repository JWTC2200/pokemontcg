"use client"

import React, { useEffect, useState, useContext } from 'react'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'
import { useSearchParams, useRouter } from 'next/navigation'
import { TQuery } from '../types/types'
import Card from '../../components/Card'
import { cardSubtypesList, cardRaritiesList, superTypes, pokemonTypes } from '@/data/carddata'
import { CardSetContext } from '@/components/SetContext'

const Search = () => {

    const AllCardSets = useContext(CardSetContext)
    const sortedCardSets = AllCardSets.sort(function(a,b){
        return Number(new Date(b.releaseDate)) - Number(new Date(a.releaseDate))
    })

    const params = new URLSearchParams()
    const router = useRouter()
    const searchParams = Array.from(useSearchParams().entries())

    // fetch states for DOM
    const [hasSearched, setHasSearched] = useState(false)
    const [searching, setSearching] = useState(false)
    const [noQuery, setNoQuery] = useState(false)

    const [cardData, setCardData] = useState<[PokemonTCG.Card]|[]>([])

    const [searchQuery, setSearchQuery] = useState<TQuery>({
        name:"",
        regulationMark: "",
        subtypes: "",
        rarity: "",
        supertype: "",
        types: "",
        "set.series": "",
        "set.name": ""
    })

    console.log(searchQuery)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setSearchQuery((prev) => {
            return (
                {...prev, [e.target.name]: `${e.target.value}`}
            )
        })
    }

    const resetForm = () => {
        setSearchQuery({
            name:"",
            regulationMark: "",
            subtypes: "",
            rarity: "",
            supertype: "",
            types: "",
            "set.series": "",
            "set.name": "",
        })
    }

    // fetch request from form button 
    const handleSubmit = (e:React.SyntheticEvent) => {
        e.preventDefault()
        handleParams()
        router.push(`/search?${params.toString()}`)
        let queryString:string = ""
        const keys = Object.keys(searchQuery) as Array<keyof typeof searchQuery>
        keys.forEach((key) => {
            if (searchQuery[key]) {
                params.set(key, searchQuery[key])
                queryString += `${key}:"${searchQuery[key]}" `
            }
        })
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
            searchParams.forEach(param => queryString += `${param[0]}:"${param[1]}" `)
            fetchCards(queryString)
        }
    }, [AllCardSets])

    // set the search params
    const handleParams = ()=> {
        const keys = Object.keys(searchQuery) as Array<keyof typeof searchQuery>
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
                return
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
                <div>
                    <label htmlFor="subtypes">Subtypes: </label>
                    <select 
                        id="subtypes" 
                        name="subtypes"
                        onChange={(e)=>handleChange(e)}
                        value={searchQuery.subtypes}
                    >
                        <option value={""} defaultValue={""}>Choose subtype</option>
                        {cardSubtypesList.map(subtype => 
                            <option 
                                value={subtype} 
                                key={subtype}
                            >
                                {subtype}
                            </option>   

                        )}
                    </select>
                </div>
                <div>
                    <label htmlFor="rarity">Card rarity: </label>
                    <select 
                        id="rarity" 
                        name="rarity"
                        onChange={(e)=>handleChange(e)}
                        value={searchQuery.rarity}
                    >
                        <option value={""} defaultValue={""}>Card rarity</option>
                        {cardRaritiesList.map(rarity => 
                            <option 
                                value={rarity} 
                                key={rarity}
                            >
                                {rarity}
                            </option>   

                        )}
                    </select>
                </div>
                <div>
                    <label htmlFor="supertype">Card type: </label>
                    <select 
                        id="supertype" 
                        name="supertype"
                        onChange={(e)=>handleChange(e)}
                        value={searchQuery.supertype}
                    >
                        <option value={""} defaultValue={""}>Choose card type</option>
                        {superTypes.map(supertype => 
                            <option 
                                value={supertype} 
                                key={supertype}
                            >
                                {supertype}
                            </option>   

                        )}
                    </select>
                </div>
                <div>
                    <label htmlFor="types">Type: </label>
                    <select 
                        id="types" 
                        name="types"
                        onChange={(e)=>handleChange(e)}
                        value={searchQuery.types}
                    >
                        <option value={""} defaultValue={""}>Choose pokemon type</option>
                        {pokemonTypes.map(type => 
                            <option 
                                value={type} 
                                key={type}
                            >
                                {type}
                            </option>   

                        )}
                    </select>
                </div>
                <div>
                    <label htmlFor="set.series">Set Series: </label>
                    <select
                        id="set.series"
                        name='set.series'
                        onChange={(e)=>{
                            handleChange(e)
                            setSearchQuery((prev) => ({...prev, ["set.name"]: "" }))
                        }}
                        value={searchQuery["set.series"]}
                    >
                        <option value={""} defaultValue={""}>Choose card set series:</option>
                        {Array.from(new Set(sortedCardSets.map(set => set.series))).map(series => 
                            <option
                                value={series}
                                key={series}
                            >
                                {series}
                            </option>    
                        )}
                    </select>
                </div>
                {
                    searchQuery["set.series"] 
                        ? <div>
                            <label htmlFor="set.name">Set name: </label>
                            <select
                                id="set.name"
                                name="set.name"
                                onChange={(e)=>handleChange(e)}
                                value={searchQuery["set.name"]}
                            >
                                <option value={""} defaultValue={""}>Choose card set series:</option>
                                {
                                    sortedCardSets.filter(set => 
                                        set.series === searchQuery["set.series"]
                                    ).map(sets => 
                                            <option
                                                value={sets.name}
                                                key={sets.name}
                                            >
                                                {sets.name}
                                            </option>
                                        )
                                }
                            </select>
                        </div>
                        : null
                }
                <div className='flex gap-4'>
                    <button
                        type="submit"
                        className='self-center red_btn mt-2'
                        disabled={searching}
                    >
                        Search
                    </button>
                    <button 
                        type="reset"
                        className='self-center red_btn mt-2'
                        onClick={()=>{resetForm()}}
                    >
                        Clear
                    </button>
                </div>
                
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