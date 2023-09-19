"use client"

import { createContext, useState, useEffect} from "react"
import { PokemonTCG } from "pokemon-tcg-sdk-typescript"

import React from 'react'

export const CardSetContext = createContext<[]|[PokemonTCG.Set]>([])

const SetContextProvider = ({children}: {children: React.ReactNode}) => {

    const [allSets, setAllSets] = useState<[]|[PokemonTCG.Set]>([])

    useEffect(() => {
      const getAllSets = async() => {
        try {
            const res = await fetch("/api/cardsets")
            const data:[PokemonTCG.Set] = await res.json()
            const sortedData = data.sort(function(a,b){
                return Number(new Date(a.releaseDate)) - Number(new Date(b.releaseDate))
            })
            setAllSets(sortedData)
        } catch (error) {
            console.log(error)
        }
      }
      getAllSets()
    }, [])

    const ContextValues = {
        cardsets: allSets
    }
    
    return (
        <CardSetContext.Provider value={allSets}>
            {children}
        </CardSetContext.Provider>
    )
}

export default SetContextProvider