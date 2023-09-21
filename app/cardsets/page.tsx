"use client"

import { useState, useEffect, useContext} from 'react'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'
import Card from '@/components/Card'
import { CardSetContext } from '@/components/SetContext'

const CardSets = () => {

    const AllCardSets = useContext(CardSetContext)

    const [cardSeries, setCardSeries] = useState<[]|string[]>([])
    const [selectedSeries, setSelectedSeries] = useState("")
    const [cardSets, setCardSets] = useState<[]|[PokemonTCG.Set]>([])
    const [selectedSet, setSelectedSet] = useState("")
    const [setCards, setSetCards] = useState<[PokemonTCG.Card]|[]>([])
    const [loading, setLoading] = useState({series: false, cards:false})

    const cardSeriesOp = cardSeries.map(series => 
        <option 
            key={series}
            value={series}
        >
            {series}
        </option>
    )

    const cardSetOp = cardSets?.filter(set => set.series === selectedSeries).map(filtered => 
        <option
            key={filtered.id}
            value={filtered.id}
        >
            {filtered.name} {`(${filtered.printedTotal} cards)`}
        </option>
    )

    const allCardEl = setCards.map(card => 
        <Card
            key={card.id}
            {...card}
        />
    )

    const getSetCards = async ()=>{
        setLoading((prev) => ({...prev, cards:true}))
        try {
            const res = await fetch(`api/cardsets/${selectedSet}`)
            const data:[PokemonTCG.Card]|[] = await res.json()
            const sortedData = data.sort(function(a,b) {
                return Number(a.number) - Number(b.number)
            })
            setSetCards(sortedData)
        } catch (error) {
            console.log(error)
        }
        setLoading((prev) => ({...prev, cards:false}))
    }

    //get up to date list of series and card sets from context to create menus
    useEffect(() => {
        const getAllSets = () => {
            !AllCardSets.length
                ? setLoading((prev)=>({...prev, series:true}))
                : setLoading((prev)=>({...prev, series:false}))

            const sortedSets = AllCardSets.sort(function(a,b){
                return Number(new Date(a.releaseDate)) - Number(new Date(b.releaseDate))
            })
            setCardSets(sortedSets)
            setCardSeries(Array.from(new Set(sortedSets.map(set => set.series))))
        }
        getAllSets()
    }, [AllCardSets]) 

    return (
        <section className='page_container gap-4'>
            { loading.series 
                ? <div>...loading</div>
                : <div className='flex gap-2'>
                    <label htmlFor="series-select">Choose a series</label>
                    <select 
                        name="series-select" 
                        id="series-select" 
                        className='text-black' 
                        onChange={(e)=>setSelectedSeries(e.target.value)}
                    >
                        <option value={""}>Choose a series</option>
                        {cardSeriesOp}
                    </select>
                </div>
            }
            { selectedSeries
                ? <div className='flex flex-col items-center'>
                     <div className='flex gap-2'>
                        <label htmlFor="set-select">Choose a set</label>
                        <select 
                            name="set-select" 
                            id="set-select" 
                            className='text-black'
                            onChange={(e)=>setSelectedSet(e.target.value)}
                        >
                            <option value={""}>Choose a set</option>
                            {cardSetOp}
                        </select>
                    </div>
                    <button 
                        type="button"
                        className='red_btn'
                        onClick={()=>getSetCards()}
                    >
                        Search
                    </button>
                </div>              
                : null
            }
            { loading.cards
                ? <div>...loading</div>
                :  setCards 
                    ? <div className='flex flex-wrap gap-4 justify-center'>
                    {allCardEl} </div>
                    : null                
            }   
        </section>
    )
}

export default CardSets