"use client"

import { useEffect, useState } from "react"
import { TDeck } from "../types/types"
import Card from "@/components/Card"
import { PokemonTCG } from "pokemon-tcg-sdk-typescript"
import { useUser } from "@auth0/nextjs-auth0/client"
import Link from "next/link"
import { deckSorting } from "../utils/decksorting"
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

    const deckEls = deckData.map(deck => {
        const {sortedPokemon, sortedTrainers, sortedEnergy} = deckData.length ? deckSorting(deck.cards) : deckSorting([])
        return (
            <Link
                key={deck.id}
                className="w-60 text-black bg-white border-4 border-gray-600 bg-gray-200 min-w-min p-2 rounded-2xl"
                href={`decks/${deck.id}`}
            >
                <h3 className="text-xl font-sembold text-center">{deck.deckname}</h3>
                <div className="flex justify-around">
                    <p>Pokemon:</p>
                    <p>{sortedPokemon.length}</p>
                </div>
                <div className="flex justify-around">
                    <p>Trainers:</p>
                    <p>{sortedTrainers.length}</p>
                </div>
                <div className="flex justify-around">
                    <p>Energy:</p>
                    <p>{sortedEnergy.length}</p>
                </div>
            </Link>
        )
    })
        

    return(
        <div className="page_container">
            <h1 className="text-3xl font-bold">Your decks</h1>
            {!deckData.length 
                ? <h2 className="self-center justify-self-center">You have no decks</h2>
                : null
            }
            <Link
                href="/decks/newdeck"
            >
                Create new deck
            </Link>
            
            <section className="flex flex-wrap justify-center gap-4">
                {
                    deckEls
                }
            </section>
            
        </div>
    )
}

export default Decks