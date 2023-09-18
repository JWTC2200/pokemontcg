"use client"

import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'

const SingleCard = () => {

    const { id } = useParams()
    
    useEffect(()=> {
        const getSingleCard = async () => {
            try {
                const res = await fetch(`api/cards/${id}`)
                const data:PokemonTCG.Card = await res.json()
                console.log(data)
            } catch (error) {
                console.log(error)
            }
        }
        getSingleCard()
    },[])


    return (
        <section className='page_container'>

        </section>
    )
}

export default SingleCard