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
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai"
import { addCardCheck } from '@/app/utils/editdeckchecks'
import { useUser } from '@auth0/nextjs-auth0/client'

const SingleDeck = () => {
  const { id } = useParams()
  const { user } = useUser()

  const [deckData, setDeckData] = useState<{}|TDeck>({})
  const [deckName, setDeckName] = useState("New deck")
  const [deckCards, setDeckCards] = useState<[] | Array<PokemonTCG.Card>>([])
  const [savingDeck, setSavingDeck] = useState(false)

  // card set data
  const AllCardSets = useContext(CardSetContext)
  const sortedCardSets = AllCardSets.sort(function(a,b){
      return Number(new Date(b.releaseDate)) - Number(new Date(a.releaseDate))
  })

  const [searchQuery, setSearchQuery] = useState({
    name: "",
    setname: "",
    supertype: "",
    format: "standard"
  })
  const [searching, setSearching] = useState(false)
  const [cardData, setCardData] = useState<[PokemonTCG.Card]|[]>([])
  const [noResults, setNoResults] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showResults, setShowResults] = useState(true)

  const resetForm = ()=> {
    setSearchQuery({
      name: "",
      setname: "",
      supertype: "",
      format: "standard"
    })
  }

  const handleChange = ((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchQuery((prev) => {
      return (
        {...prev, [e.target.name]: `${e.target.value}`}
      )
    })
  })

  const handeSearchSubmit = (e: React.SyntheticEvent) => {
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
        setNoResults(true)
        return
      }
      const sortedData = data.sort(function(a: PokemonTCG.Card, b:PokemonTCG.Card) {
        return Number(a.number) - Number(b.number)
      }).sort(function(a: PokemonTCG.Card,b: PokemonTCG.Card){
          return Number(new Date(b.set.releaseDate)) - Number(new Date(a.set.releaseDate))
      })
      setCardData(sortedData)
      setNoResults(false)
    } catch(error) {
      console.log(error)
    }
  }

  const addCard = (card:PokemonTCG.Card)=>{
    addCardCheck(deckCards, card) && setDeckCards(prev => [...prev, card])
  }

  const removeCard = (card:PokemonTCG.Card)=> {
    // finds index of first matching card id then remove
    setDeckCards((prev)=> {
      const cardIndex = prev.findIndex(card => card.id === card.id)
      return prev.filter((card, index) => index != cardIndex)
    })
  }

  const handleSaveDeck = async ()=>{
    if (!user) {
      console.log("Please log in before saving")
      return
    }
    setSavingDeck(true)
    try {
      const res = await fetch("/api/decks", {
        method: "POST",
        body: JSON.stringify({
          owner: user.sub,
          deckname: deckName,
          cards: deckCards,
        })
      })
      if (res.ok) {
        console.log("deck saved")
      } else {
        console.log("save failed")
      }
      setSavingDeck(false)
    } catch (error) {
      console.log(error)
    }

  }


  useEffect(()=> {
    // don't bother fetching if its new
    if(id === "newdeck") {
      return
    }
    const fetchDeck = async ()=>{
      try {
        const res = await fetch(`/api/decks/deck/${id}`)
        const data = await res.json()
        // don't change deckdata if no results 
        if(!data) {
          // change this for an alert or page message
          console.log("No such deck")
          return 
        }
        setDeckData(data[0])
        setDeckName(data[0].deckname)
        setDeckCards(data[0].cards)
      } catch (error) {
        console.log(error)
      }
    }
    fetchDeck()
  },[])

  const { sortedPokemon, sortedTrainers, sortedEnergy } = deckCards.length ? deckSorting(deckCards) : deckSorting([])

  return (
    <div
        className='page_container'
    > 
      { showForm
        ? <div
          className='w-full bg-white text-black flex items-center mt-4 justify-between px-4 py-1 cursor-pointer'
          onClick={()=>setShowForm(prev=>!prev)}
        >
          Hide search
          <AiOutlineMinusCircle className="text-2xl"/>       
        </div>
        : <div
          className='w-full bg-white text-black flex items-center mt-4 justify-between px-4 py-1 cursor-pointer'
          onClick={()=>setShowForm(prev=>!prev)}
        >
          Search for cards: 
          <AiOutlinePlusCircle className="text-2xl"/>          
        </div>     
      }

      { showForm
        ? <form 
          className='text-black flex flex-col items-start w-full p-2'
          onSubmit={handeSearchSubmit}
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
        : null
      }

      {noResults ? <div>No results</div> : null}
      {searching ? <div>...searching</div>: null}

      { cardData.length  
        ? showResults 
          ?<div
            className='w-full bg-white text-black flex items-center my-4 justify-between px-4 py-1 cursor-pointer'
            onClick={()=>setShowResults(prev=>!prev)}
          >
            Hide results
            <AiOutlineMinusCircle className="text-2xl"/>
          </div>
          : <div
            className='w-full bg-white text-black flex items-center my-4 justify-between px-4 py-1 cursor-pointer'
            onClick={()=>setShowResults(prev=>!prev)}
          >
            Show results
            <AiOutlinePlusCircle className="text-2xl"/>
          </div>
        : null
      }
      { cardData.length && showResults
        ? <section className="flex flex-wrap gap-4 justify-center ">
            {cardData.map(card => 
              <DeckCards 
                key={card.id}
                image={card.images.small}
                addCard={()=>addCard(card)}
                removeCard={()=>removeCard(card)}
                inDeck={false}
              />  
            )}
          </section>
        : null
      }

      <div className='flex flex-col justify-center items-center w-full sm:flex-row'>
        <form
          onSubmit={(e)=>e.preventDefault()}
          className='text-black flex items-center gap-2 items-start p-2'
        >
            <label 
              htmlFor='deckname'
              className='min-w-max'
            >
              Deck name:
            </label>
            <input
              id="deckname"
              name="deckname"
              placeholder="Deck name"
              onChange={(e)=>setDeckName(e.target.value)}
              value={deckName}
              className="input_field"
            ></input>
        </form>      
        <button 
          type="button"
          onClick={handleSaveDeck}
          className='py-1 px-2 bg-red-300 rounded-2xl min-w-max'
          disabled={savingDeck}
        >
          Save deck
        </button>
      </div>
      

      <h3 className='mt-4'>Pokemon {sortedPokemon.length}</h3>
      <section className="flex flex-wrap gap-4 justify-center ">
        {sortedPokemon.map((card, index) => 
          <DeckCards 
            key={`${card.id}${index}`}
            image={card.images.small}
            addCard={()=>addCard(card)}
            removeCard={()=>removeCard(card)}
            inDeck={true}
          />
        )}
      </section>
      <h3>Trainers {sortedTrainers.length}</h3>
      <section className="flex flex-wrap gap-4 justify-center ">
        {sortedTrainers.map((card, index) => 
          <DeckCards 
            key={`${card.id}${index}`}
            image={card.images.small}
            addCard={()=>addCard(card)}
            removeCard={()=>removeCard(card)}
            inDeck={true}
          />
        )}
      </section>
      <h3>Energy {sortedEnergy.length}</h3>
      <section className="flex flex-wrap gap-4 justify-center ">
        {sortedEnergy.map((card, index) => 
          <DeckCards 
            key={`${card.id}${index}`}
            image={card.images.small}
            addCard={()=>addCard(card)}
            removeCard={()=>removeCard(card)}
            inDeck={true}
          />
        )}
      </section>
        
    </div>
  )
}

export default SingleDeck