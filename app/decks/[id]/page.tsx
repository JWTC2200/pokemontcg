"use client"

import { TDeck } from '@/app/types/types'
import { deckSorting } from '@/app/utils/decksorting'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Card from '@/components/Card'

const SingleDeck = () => {
  const { id } = useParams()

  const [deckData, setDeckData] = useState<[]|[TDeck]>([])

  useEffect(()=> {
    const getDeck = async ()=>{
      try {
        const res = await fetch(`/api/decks/deck/${id}`)
        const data = await res.json()
        setDeckData(data)
      } catch (error) {
        console.log(error)
      }
    }
    getDeck()
  },[])

  console.log(deckData)

  const { sortedPokemon, sortedTrainers, sortedEnergy } = deckData.length ? deckSorting(deckData[0].cards) : deckSorting([])
  console.log(sortedPokemon)

  return (
    <div
        className='page_container'
    >
      <section>
        <div className='nav_btn'>collapse</div>
      </section>
      <h3>Pokemon {sortedPokemon.length}</h3>
      <section className="flex flex-wrap gap-4 justify-center ">
        {sortedPokemon.map((card, index) => 
          <Card 
            key={`${card.id}${index}`}
            {...card}
          />
        )}
      </section>
      <h3>Trainers {sortedTrainers.length}</h3>
      <section className="flex flex-wrap gap-4 justify-center ">
        {sortedTrainers.map((card, index) => 
          <Card 
            key={`${card.id}${index}`}
            {...card}
          />
        )}
      </section>
      <h3>Energy {sortedEnergy.length}</h3>
      <section className="flex flex-wrap gap-4 justify-center ">
        {sortedEnergy.map((card, index) => 
          <Card 
            key={`${card.id}${index}`}
            {...card}
          />
        )}
      </section>
        
    </div>
  )
}

export default SingleDeck


// if (deckData[0]) {
//   const { sortedPokemon, sortedTrainers, sortedEnergy } = deckSorting(deckData[0].cards)

// }