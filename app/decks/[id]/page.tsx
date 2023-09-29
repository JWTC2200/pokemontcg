"use client"

import { TDeck } from '@/app/types/types'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'
import { deckSorting } from '@/app/utils/decksorting'
import { useParams, notFound } from 'next/navigation'
import { CardSetContext } from '@/components/SetContext'
import React, { useEffect, useState, useContext } from 'react'
import Card from '@/components/Card'
import DeckCards from '@/components/DeckCards'
import { superTypes } from '@/data/carddata'

const SingleDeck = () => {
  const { id } = useParams()
  const [deckData, setDeckData] = useState<[]|[TDeck]>([])
  const [deckCards, setDeckCards] = useState<[] | [PokemonTCG.Card]>([])

  // card set data
  const AllCardSets = useContext(CardSetContext)
  const sortedCardSets = AllCardSets.sort(function(a,b){
      return Number(new Date(b.releaseDate)) - Number(new Date(a.releaseDate))
  })

  const [editting, setEditting] = useState(false)

  const [searchQuery, setSearchQuery] = useState({
    name: "",
    setname: "",
    supertype: "",
    format: "standard"
  })
  const [searching, setSearching] = useState(false)
  const [cardData, setCardData] = useState<[PokemonTCG.Card]|[]>([])

  const handleChange = ((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchQuery((prev) => {
      return (
        {...prev, [e.target.name]: `${e.target.value}`}
      )
    })
  })

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    const query = new URLSearchParams(searchQuery)
    fetchCards(query)
  }
  
  const fetchCards = async(query:URLSearchParams)=>{
    if (searching) return
    setSearching(true)
    try {
      const res = await fetch(`/api/cards/deck?${query.toString()}`)
      const data = await res.json()
      setSearching(false)
      if(!data.length) {
        setCardData(data)
        setSearching(false)
        return
      }
      const sortedData = data.sort(function(a: PokemonTCG.Card, b:PokemonTCG.Card) {
        return Number(a.number) - Number(b.number)
      }).sort(function(a: PokemonTCG.Card,b: PokemonTCG.Card){
          return Number(new Date(b.set.releaseDate)) - Number(new Date(a.set.releaseDate))
      })
      setCardData(sortedData)
    } catch(error) {
      console.log(error)
    }
  }

  const addCard = ()=>{
    console.log("added")
  }

  const removeCard = ()=> {
    console.log("removed")
  }

  useEffect(()=> {
    // don't bother loading deck if its new
    if(id === "newdeck") {
      setEditting(true)
      return
    }
    const getDeck = async ()=>{
      try {
        const res = await fetch(`/api/decks/deck/${id}`)
        const data = await res.json()
        // don't change deckdata if no results 
        if(!data) {
          // change this for an alert or page message
          console.log("No such deck")
          return 
        }
        setDeckData(data)
        setDeckCards(data[0].cards)
      } catch (error) {
        console.log(error)
      }
    }
    getDeck()
  },[])

  const { sortedPokemon, sortedTrainers, sortedEnergy } = deckCards.length ? deckSorting(deckCards) : deckSorting([])

  return (
    <div
        className='page_container'
    > 
      { editting 
        ? <form 
        className='text-black flex flex-col items-start w-full p-2'
        onSubmit={handleSubmit}
      >
        <div className="flex flex-wrap gap-2 w-full lg:justify-center sm:flex-nowrap">
          <div className='search_option'>
            <label htmlFor='name' className='text-xl font-semibold'>Card Name: </label>
            <input
              id="name"
              name="name"
              placeholder='Card name'
              onChange={handleChange}
              className='input_field'
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
            <label htmlFor="setname" className="text-xl font-semibold">Set Name: </label>
            <select
              id="setname"
              name="setname"
              onChange={(e)=>handleChange(e)}
              value={searchQuery.setname}
              className='select_field'
            >
              <option value="" defaultValue="">
                  Select set
              </option>
              { sortedCardSets.map(sets => 
                <option
                    value={sets.name}
                    key={sets.name+sets.series}
                >
                    {`${sets.name} (${sets.printedTotal} cards)`}
                </option>
              )}
            </select>
          </div>
          <div className='search_option'>
            <label htmlFor="format" className="text-xl font-semibold">Format: </label>
            <select
              id="format"
              name="format"
              onChange={(e)=>handleChange(e)}
              value={searchQuery.format}
              className='select_field'
            >
              <option value="standard">Standard</option>
              <option value="expanded">Expanded</option>
            </select>
          </div>
        </div>        
      </form>
        : null

      }
      
      { editting && cardData.length 
        ? <section className="flex flex-wrap gap-4 justify-center ">
        {cardData.map(card => 
          <DeckCards 
            key={card.id}
            image={card.images.small}
            editting={editting}
            addCard={addCard}
            removeCard={removeCard}
          />  
        )}
      </section>
        : null
      }      

      <h3 className='mt-20'>Pokemon {sortedPokemon.length}</h3>
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