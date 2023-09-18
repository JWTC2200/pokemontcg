"use client"

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'
import Card from '@/app/components/Card'

const SingleCard = () => {

    const { id } = useParams()
    const [cardData, setCardData] = useState<PokemonTCG.Card|null>(null)    
    
    useEffect(()=> {
        const getSingleCard = async () => {
            try {
                const res = await fetch(`/api/cards/${id}`)
                const data:PokemonTCG.Card = await res.json()
                setCardData(data)
            } catch (error) {
                console.log(error)
            }
        }
        getSingleCard()
    }, [])

    

    return (
        <section className='page_container'>
            {cardData
            ? <Card {...cardData}/>
            : null
            
        
            }
        </section>
    )
}

export default SingleCard