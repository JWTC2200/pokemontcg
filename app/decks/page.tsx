"use client"

import { useEffect, useState } from "react"
import { TDeck } from "../types/types"
import Card from "@/components/Card"
import { PokemonTCG } from "pokemon-tcg-sdk-typescript"
import { useUser } from "@auth0/nextjs-auth0/client"
import Link from "next/link"

const Decks = () => {

    const [deckData, setDeckData] = useState<[] | [TDeck]>([])

    const { user } = useUser()

    const getUserDecks = async () => {
        try {
            const res = await fetch(`/api/decks/${user?.sub}`)
            const data = await res.json()
            console.log(data)
            setDeckData(data)            
        } catch (error) {
            console.log(error)
    }}

    useEffect(()=> {
        if(user) {
            getUserDecks()
        }
    }, [])



    return(
        <div className="page_container">
            {
                deckData.map(deck =>
                    <Link
                        key={deck.id}
                        className="nav_btn"
                        href={`decks/${deck.id}`}
                    >
                        {deck.deckname}
                   </Link>
 
                )
            }
        </div>
    )
}

export default Decks