"use client"

import { TDeck } from '@/app/types/types'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'
import { deckSorting } from '@/app/utils/decksorting'
import { useParams, useRouter } from 'next/navigation'
import { CardSetContext } from '@/components/SetContext'
import React, { useEffect, useState, useContext } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import DeckCards from '@/components/DeckCards'
import { superTypes } from '@/data/carddata'
import { AiOutlinePlusCircle, AiOutlineMinusCircle, AiOutlineCloseCircle } from "react-icons/ai"
import { BsFillGridFill, BsPencilFill } from "react-icons/bs"
import {TbCardsFilled} from "react-icons/tb"
import { addCardCheck } from '@/app/utils/editdeckchecks'
import { useUser } from '@auth0/nextjs-auth0/client'
import Switch from "react-switch"
import Pagination from '@/components/Pagination'

export const dynamic = "force-dynamic"
export const revalidate = 0

const SingleDeck = () => {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useUser()

  const [deckName, setDeckName] = useState("New deck")
  const [deckCards, setDeckCards] = useState<[] | Array<PokemonTCG.Card>>([])
  const [savingDeck, setSavingDeck] = useState(false)
  const [deleteDeck, setDeleteDeck] = useState(false)
  const [viewMode, setViewMode] = useState(true)

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

  // pagination
  const itemsPerPage = 20
  const [itemOffset, setItemOffset] = useState(0)
  const endOffset = itemOffset + itemsPerPage
  const currentItems = cardData.slice(itemOffset, endOffset)
  const pageCount = Math.ceil(cardData.length / itemsPerPage)
  const handlePageClick = (e:number) => {
      const newOffset = (e * itemsPerPage) % cardData.length
      setItemOffset(newOffset)
  }

  // view card
  const [overlayCard , setOverlayCard ] = useState("")
  const [showOverlayCard, setShowOverlayCard] = useState(false)

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
      setShowForm(false)
      setNoResults(false)
    } catch(error) {
      console.log(error)
    }
  }

  const addCard = (card:PokemonTCG.Card)=>{
    const checkResults = addCardCheck(deckCards, card)
    if (checkResults.result) {
        setDeckCards(prev => [...prev, card])
      toast.success(`${card.name} added`)
    }
    else {
      toast.error(`${checkResults.message}`)
    }
  }

  const removeCard = (card:PokemonTCG.Card)=> {
    // finds index of first matching card id then remove
    const cardIndex = deckCards.findIndex(deckcard => deckcard.id === card.id)
    setDeckCards((prev)=> {
      return prev.filter((_, index) => index !== cardIndex)
    })
    toast.warning(`${card.name} removed`)
  }

  const handleSaveDeck = async ()=>{
    if (!user) {
      console.log("Please log in before saving")
      return
    }
    if (!deckName) {
      toast.warning("Please enter a name for the deck!", {autoClose: 3000})
      return
    }
    if (deckName.length >=25) {
      toast.warning("Deck name too long!", {autoClose: 3000})
      return
    }
    setSavingDeck(true)
    if (id === "newdeck") {
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
        const data = await res.json()
        router.replace(`/decks/${data.data[0].id}`)
      } catch(error ) {
        console.log(error)
      }
    } else {
      try {
        const res = await fetch("/api/decks", {
          method: "PUT",
          body: JSON.stringify({
            id: id,
            owner: user.sub,
            deckname: deckName,
            cards: deckCards,
          })
        })
        if (res.ok) {
          toast.success("deck saved!")
        } else {
          toast.error("save failed")
        }
      } catch (error) {
        console.log(error)
      }
    }    
    setSavingDeck(false)
  }

  const handleDeleteDeck = async () => {
    if(!user) {
      return
    }
    try {
      const res = await fetch("/api/decks", {
        method: "DELETE",
        body: JSON.stringify ({
          id: id,
          owner: user.sub,
        })
      })
      if (res.ok) {
        router.replace("/decks")
      } else {
        console.log("save failed")
      }
    } catch(error) {
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
          // redirect them if doesn't exist
          router.push("/decks")
        }
        setDeckName(data[0].deckname)
        setDeckCards(data[0].cards)
      } catch (error) {
        console.log(error)
      }
    }
    fetchDeck()
  },[])

  const { sortedPokemon, sortedTrainers, sortedEnergy } = deckCards.length ? deckSorting(deckCards) : deckSorting([])

  // display toggles
  const displayedCards = (data: Array<PokemonTCG.Card>) => {
    if (!viewMode) {
      return( data.map((card, index) => 
        <DeckCards 
          key={`${card.id}${index}`}
          image={card.images.small}
          addCard={()=>addCard(card)}
          removeCard={()=>removeCard(card)}
          viewOverlay={()=>viewOverlay(card.images.large)}
          inDeck={true}
          number={0}
        />
      ))
    } else {
      // get number of each unique card name
      const uniques = Array.from(new Set(data.map(card => card.name)))
      const uniqueCards = uniques.map(name => {
        const firstCopy = data.find(card => card.name === name)
        const numberCopy = data.filter(card => card.name === name).length
        return {card: firstCopy!, number: numberCopy}
      })
      return (uniqueCards.map((card, index) => 
        <DeckCards
          key={`${card.card.id}${index}`}
          image={card.card.images.small}
          addCard={()=>addCard(card.card)}
          removeCard={()=>removeCard(card.card)}
          viewOverlay={()=>viewOverlay(card.card.images.large)}
          inDeck={true}
          number={card.number}
        />
      ))
    }   
  }
  const viewOverlay = (image:string)=> {
    setOverlayCard(image)
    setShowOverlayCard(true)
  }

  return (
    <main
        className='page_container'
    > 
      <ToastContainer
        toastClassName={"w-60 overflow-hidden"}
        draggable={false}
        closeOnClick
        autoClose={1000}
        newestOnTop
        pauseOnFocusLoss={false}
      />
      
      {showOverlayCard 
        ? <section 
          className='fixed w-screen h-screen bg-black z-20 bg-opacity-50 top-0 flex justify-center items-center'
          onClick={()=>setShowOverlayCard(prev=>!prev)}
        >
          <div className='flex flex-col items-center justify-center w-full px-8'>            
            <img 
              src={overlayCard}
              className='max-w-full sm:max-w-md'
            />
            <AiOutlineCloseCircle className="text-4xl sm:text-6xl font-bold mt-4 hover:text-red-500"/>
          </div>
        </section>
        : null
      }

      <div className='flex flex-col justify-center items-center w-full'>
        <form
          onSubmit={(e)=>e.preventDefault()}
          className='text-black flex items-center gap-2 items-start p-2'
        >
          <input
            id="deckname"
            name="deckname"
            placeholder="Deck name"
            onChange={(e)=>setDeckName(e.target.value)}
            value={deckName}
            className="w-full placeholder-gray-500 px-2 h-8 bg-white bg-opacity-50 outline-none rounded-lg focus:bg-white text-center text-2xl"
            maxLength={24}
          />
          <label htmlFor='deckname'>
            <BsPencilFill/>
          </label>          
        </form>      
        <button 
          type="button"
          onClick={handleSaveDeck}
          className='py-1 px-2 bg-green-400 text-black rounded-2xl mt-2 min-w-max'
          disabled={savingDeck}
        >
          Save deck
        </button>
      </div>
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
                value={searchQuery.name}
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

      {noResults ? <div className='text-2xl text-red-500'>No results</div> : null}
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
        ? <section className="flex flex-col justify-center items-center gap-2">
            <div className="flex flex-wrap gap-4 justify-center">
              {currentItems.map(card => 
                <DeckCards 
                  key={card.id}
                  image={card.images.small}
                  addCard={()=>addCard(card)}
                  removeCard={()=>removeCard(card)}
                  viewOverlay={()=>viewOverlay(card.images.large)}
                  inDeck={false}
                  number={0}
                />  
              )}
            </div>
            <Pagination
              pageCount={pageCount}
              onPageChange={handlePageClick}
            />            
          </section>
        : null
      }
      
      <div className='flex gap-1 self-start justify-self-start items-center mt-4 ml-8 text-black'>
        <Switch  
            onChange={()=>{setViewMode(prev => !prev)}} 
            checked={viewMode} 
            checkedIcon={< TbCardsFilled className="w-full h-full p-1 text-white"/>}
            uncheckedIcon={< BsFillGridFill className="w-full h-full p-1 text-white"/>}
        />
        <h4>{viewMode ? "Stacked": "Spread"}</h4>
      </div>

      <h3 className='my-2 text-slate-800 font-bold text-2xl'>Pokemon {sortedPokemon.length}</h3>
      <section className="flex flex-wrap gap-4 justify-center ">
        {displayedCards(sortedPokemon)}
      </section>
      <h3 className='my-2 text-slate-800 font-bold text-2xl'>Trainers {sortedTrainers.length}</h3>
      <section className="flex flex-wrap gap-4 justify-center ">
        {displayedCards(sortedTrainers)}
      </section>
      <h3 className='my-2 text-slate-800 font-bold text-2xl'>Energy {sortedEnergy.length}</h3>
      <section className="flex flex-wrap gap-4 justify-center ">
        {displayedCards(sortedEnergy)}
      </section>
      {
        id != "newdeck" 
        ? !deleteDeck 
            ? <button
              type="button"
              className='nav_btn mt-4'
              onClick={()=>setDeleteDeck(true)}
            >
              Delete deck
            </button>
            : <div className='flex flex-col gap-2'>
              <button
                type="button"
                className='nav_btn mt-4'
                onClick={()=>setDeleteDeck(false)}
              >
                Cancel 
              </button> 
              <button
                type="button"
                className='nav_btn  mt-4'
                onClick={handleDeleteDeck}
              >
                Confirm delete
              </button>

            </div>              
        
        
        : null
      }
    </main>
  )
}

export default SingleDeck