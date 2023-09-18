"use client"

import { useState, useEffect} from 'react'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'

const CardSets = () => {

    const [cardSets, setCardSets] = useState<[]|[PokemonTCG.Set]>([])
    const [selectedSet, setSelectedSet] = useState("")
    const [cardSeries, setCardSeries] = useState<[]|string[]>([])
    
    const cardSeriesEl = cardSeries.map(series => 
        <div 
            key={series}
            className='red_btn cursor-pointer'
            onClick={()=>setSelectedSet(series)}
        >
            {series}
        </div>
    )

    const cardSetsEl = cardSets?.filter(set => set.series === selectedSet).map(filtered => 
        <div
            key={filtered.id}
            className="red_btn"
        >
            {filtered.name}
        </div>
        )


    useEffect(() => {
        const getAllSets = async () => { 
            try {
                const res = await fetch("api/cardsets")
                const data:[PokemonTCG.Set] = await res.json()
                setCardSets(data)
                setCardSeries(Array.from(new Set(data.map(set => set.series))))
            } catch (error) {
                console.log(error)
            }
        }
        getAllSets()
    }, []) 

    const testing = async () => { 
        try {
            const res = await fetch("api/cardsets")
            const data = await res.json()
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className='page_container'>
            <section className='flex flex-wrap gap-2'>
                {cardSeriesEl}
            </section>
            {
                selectedSet
                ? <section 
                    className='flex flex-wrap gap-2'
                >{cardSetsEl}</section>
                : null
            }
            
        </section>
    )
}

export default CardSets