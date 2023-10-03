"use client"

import { useEffect, useState } from "react"
import { TDeck } from "../types/types"
import Card from "@/components/Card"
import { PokemonTCG } from "pokemon-tcg-sdk-typescript"
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
            setDeckData(data)            
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
            <tr className='even:bg-gray-300 odd:bg-white py-1 text-black'>
                <td className="pl-2">
                    <Link
                        href={`/decks/${deck.id}`}
                        className="hover:text-red-500"
                    >
                        {`${deck.deckname} (${deck.cards.length}/60)`}
                    </Link>
                </td>
                <td className="text-center">{sortedPokemon.length}/{sortedTrainers.length}/{sortedEnergy.length}</td>
                <td className="text-center">{new Date(deck.created_at).toLocaleString("en-gb",{day: "numeric", month: "long", year: "numeric", })}</td>
                {/* <td className="text-center"></td> */}
            </tr>
        )
    })
        

    return(
        <div className="page_container">          
            <Link
                href="/decks/newdeck"
                className="mb-6 bg-black py-1 px-4 rounded-xl cursor-pointer font-semibold text-xl text-slate-300"
            >
                New deck
            </Link>
            {!deckData.length 
                ? <h2 className="self-center justify-self-center text-red-700 text-4xl font-bold">You have no decks!</h2>
                : <table className="w-full table-auto">
                    <thead className="sm:text-lg text-sm bg-gray-800 text-white font-rye h-12">
                        <tr>
                            <th className="text-start pl-2">Deck</th>
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