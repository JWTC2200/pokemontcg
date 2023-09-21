"use client"

import React, { useEffect, useState, useContext } from 'react'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'
import { useSearchParams, useRouter } from 'next/navigation'
import { TQuery } from '../types/types'
import Card from '../../components/Card'
import { cardSubtypesList, cardRaritiesList, superTypes, pokemonTypes } from '@/data/carddata'
import { CardSetContext } from '@/components/SetContext'
import { IoMdClose, IoMdOpen } from "react-icons/io"

const Search = () => {

    

    const AllCardSets = useContext(CardSetContext)
    const sortedCardSets = AllCardSets.sort(function(a,b){
        return Number(new Date(b.releaseDate)) - Number(new Date(a.releaseDate))
    })

    const params = new URLSearchParams()
    const router = useRouter()
    const searchParams = Array.from(useSearchParams().entries())

    const [toggleAdvanced, setToggleAdvanced] = useState(false)
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
    }, [])

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
            if(searching) {
                return
            }  
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
                    // if no results skip sorting 
                    if(!data.length) {
                        setCardData(data)
                        setSearching(false)
                        return
                    }
                    // sort cards by set release then sort by Id within set
                    const sortedData = data.sort(function(a: PokemonTCG.Card,b: PokemonTCG.Card){
                        return Number(new Date(b.set.releaseDate)) - Number(new Date(a.set.releaseDate))
                    })
                    setCardData(sortedData)
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
                className='text-black flex flex-col items-start w-full p-2'
                onSubmit={handleSubmit}
            > 
                {/* basic search options name, card type then sets */}
                <div className="flex flex-wrap gap-2 w-full lg:justify-center sm:flex-nowrap">
                    <div className='search_option'>
                        <label htmlFor="name" className="text-xl font-semibold">Card Name: </label>
                        <input 
                            id="name"
                            name="name" 
                            placeholder='Card name'
                            onChange={(e)=>handleChange(e)}
                            value={searchQuery.name}
                            className="input_field"
                        />
                    </div>
                    <div className='search_option'>
                        <label htmlFor="supertype" className="text-xl font-semibold">Card Type: </label>
                        <select 
                            id="supertype" 
                            name="supertype"
                            onChange={(e)=>handleChange(e)}
                            value={searchQuery.supertype}
                            className='select_field'
                        >
                            <option value="" defaultValue="">All</option>
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
                </div>
                <div className="flex flex-wrap gap-2 mt-4 w-full lg:justify-center sm:flex-nowrap">
                    <div className='search_option'>
                        <label htmlFor="set.series" className="text-xl font-semibold">Sort By Series: </label>
                        <select
                            id="set.series"
                            name='set.series'
                            onChange={(e)=>{
                                handleChange(e)
                                setSearchQuery((prev) => ({...prev, ["set.name"]: "" }))
                            }}
                            value={searchQuery["set.series"]}
                            className='select_field'
                        >
                            <option value="" defaultValue="">Select series</option>
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
                    <div className='search_option'>
                        <label htmlFor="set.name" className="text-xl font-semibold">Set Name: </label>
                        <select
                            id="set.name"
                            name="set.name"
                            onChange={(e)=>handleChange(e)}
                            value={searchQuery["set.name"]}
                            className='select_field'
                        >
                            <option value="" defaultValue="">
                                Select set
                            </option>
                            { searchQuery["set.series"] 
                                ? sortedCardSets.filter(sets => sets.series === searchQuery["set.series"]).map(sets => 
                                    <option
                                        value={sets.name}
                                        key={sets.name+sets.series}
                                    >
                                        {`${sets.name} (${sets.printedTotal} cards)`}
                                    </option>
                                )
                                : sortedCardSets.map(sets => 
                                    <option
                                        value={sets.name}
                                        key={sets.name+sets.series}
                                    >
                                        {`${sets.name} (${sets.printedTotal} cards)`}
                                    </option>
                                )
                            }
                        </select>
                    </div>
                </div>
                <div className="flex w-full sm:justify-center">
                    <div 
                        className='text-white bg-black my-4 px-3 py-1 rounded-xl gap-2 flex items-center cursor-pointer'
                        onClick={()=>setToggleAdvanced(prev=>!prev)}
                    >
                        Advanced options {toggleAdvanced ? <IoMdClose/> : <IoMdOpen/>}
                    </div>
                </div>
                { toggleAdvanced 
                    ? <div className="flex flex-wrap gap-2 mb-2 w-full lg:justify-center">
                        <div className='search_option'>
                            <label htmlFor="types" className="text-xl font-semibold">Energy type: </label>
                            <select 
                                id="types" 
                                name="types"
                                onChange={(e)=>handleChange(e)}
                                value={searchQuery.types}
                                className='select_field'
                            >
                                <option value="" defaultValue="">Select energy type</option>
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
                        <div className='search_option'>
                            <label htmlFor="rarity" className="text-xl font-semibold">Card rarity: </label>
                            <select 
                                id="rarity" 
                                name="rarity"
                                onChange={(e)=>handleChange(e)}
                                value={searchQuery.rarity}
                                className='select_field'
                            >
                                <option value="" defaultValue="">Card rarity</option>
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
                        <div className='search_option'>
                            <label htmlFor="regulationMark" className="text-xl font-semibold">Regulation mark: </label>
                            <input 
                                id="regulationMark" 
                                name="regulationMark"
                                placeholder='Regulation mark'
                                onChange={(e)=>handleChange(e)}
                                value={searchQuery.regulationMark}
                                className="input_field"
                            />
                        </div>
                        <div className='search_option'>
                            <label htmlFor="subtypes" className="text-xl font-semibold">Subtypes: </label>
                            <select 
                                id="subtypes" 
                                name="subtypes"
                                onChange={(e)=>handleChange(e)}
                                value={searchQuery.subtypes}
                                className='select_field'
                            >
                                <option value="" defaultValue="">Choose subtype</option>
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
                    </div>
                    : null                    
                }
                <div className="flex gap-2 w-full sm:justify-center">
                    <button
                        type="submit"
                        className='self-center nav_btn mt-2'
                        disabled={searching}
                    >
                        Search
                    </button>
                    <button 
                        type="reset"
                        className='self-center nav_btn mt-2'
                        onClick={()=>{resetForm()}}
                    >
                        Reset
                    </button>            
                </div>
                
            </form>
            {
                noQuery 
                ? <div className="text-red-500 text-xl mt-4">Please provide at least one search option!</div>
                : null
            }
            <section className='flex flex-wrap gap-4 justify-center pb-16 w-full'>            
                { hasSearched 
                    ?  searching 
                        ? <div className="text-yellow-600 text-xl mt-4">...loading</div>
                        : dataEl.length ? dataEl : <div className="text-red-500 text-xl mt-4">No results</div>
                    : null               
                }                
            </section>
        </section>
    )
}

export default Search