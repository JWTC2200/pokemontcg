"use client"

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'
import Link from 'next/link'

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

    console.log(cardData)

    return (
        <section className='page_container'>
            {cardData
            ? <div className="flex flex-col md:flex-row md:justify-between w-full border border-black">
                <section className="border w-full">
                    <img 
                        src={cardData.images.large} 
                        className="w-96 pt-4"
                    />
                </section>
                <section className="border w-full px-2">
                    <h1 className="text-center">{cardData.name}</h1>
                    <p>{cardData.subtypes[0]} {cardData.supertype} <span>1</span></p>
                    {cardData.evolvesFrom 
                        ? <p>Evolves from: <Link 
                            className="underline hover:font-semibold"
                            href={`/search?name=${cardData.evolvesFrom}`}
                        >
                            {cardData.evolvesFrom}
                        </Link></p> 
                        : null 
                    }
                    {cardData.evolvesTo 
                        ? <p>Evolves from: <Link 
                            className="underline hover:font-semibold"
                            href={`/search?name=${cardData.evolvesTo}`}
                        >
                            {cardData.evolvesTo}
                        </Link></p> 
                        : null 
                    }
                </section>
                <section className="border w-full">
                    prices
                </section>
            </div>
            : null
            
        
            }
        </section>
    )
}

export default SingleCard