"use client"

import { useEffect, useState } from "react"
import { TDeck } from "../types/types"
import { useUser } from "@auth0/nextjs-auth0/client"
import Link from "next/link"
import { deckSorting } from "../utils/decksorting"

export const dynamic = "force-dynamic"
export const revalidate = 0

const Decks = () => {

    const [deckData, setDeckData] = useState<[] | [TDeck]>([])

    const { user } = useUser()

    const getUserDecks = async () => {
        try {
            const res = await fetch(`/api/decks/${user?.sub}`, {
                cache: "no-store"
            })
            const data = await res.json()
            const sortedData = data.sort((a:TDeck,b:TDeck)=>{
                return Number(new Date(b.created_at)) - Number(new Date(a.created_at))
            })
            setDeckData(sortedData)            
        } catch (error) {
            console.log(error)
    }}

    useEffect(()=> {
        if(user) {
            getUserDecks()
        }
    }, [user])

    const decktableEls = deckData.map(deck => {
        const {sortedPokemon, sortedTrainers, sortedEnergy} = deckData.length ? deckSorting(deck.cards) : deckSorting([])

        return (
            <tr 
                key={deck.created_at}
                className='even:bg-gray-300 odd:bg-white py-1 text-black font-josefin'
            >
                <td className="pl-3">
                    <Link
                        href={`/decks/${deck.id}`}
                        className="hover:text-red-500"
                    >
                        {`${deck.deckname} (${deck.cards.length}/60)`}
                    </Link>
                </td>
                <td className="text-center">{sortedPokemon.length}/{sortedTrainers.length}/{sortedEnergy.length}</td>
                <td className="text-center">{new Date(deck.created_at).toLocaleString("en-gb",{day: "numeric", month: "long", year: "numeric", })}</td>
            </tr>
        )
    })
        

    return(
        <div className="page_container">          
            <Link
                href="/decks/newdeck"
                className="mb-4 bg-black py-1 px-4 rounded-xl cursor-pointer font-semibold text-xl text-slate-300 font-josefin"
            >
                New deck
            </Link>
            {!deckData.length 
                ? <h2 className="self-center justify-self-center text-red-700 text-4xl font-bold">You have no decks!</h2>
                : <table className="w-full table-auto">
                    <thead className="sm:text-lg text-md bg-gray-800 text-white font-rye h-12">
                        <tr>
                            <th className="text-start pl-3">Deck</th>
                            <th className="text-center">P/T/E</th>
                            <th className="text-center">Created</th>
                            {/* <th className="text-center">Energy</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {decktableEls}
                    </tbody>                
                </table>
            }
            
            
        </div>
    )
}

export default Decks