"use client"

import React from 'react'

const NewDeck = () => {
  return (
    <div>page</div>
  )
}

export default NewDeck


    // const saveDeck = async (e: React.SyntheticEvent) => {
    //     e.preventDefault()
    //     setSaving(true)
    //     try {
    //         const res = await fetch("/api/decks", {
    //             method: "POST",
    //             body: JSON.stringify({
    //                 deckname: deckName,
    //                 owner: user?.sub,
    //                 cards: localDeck
    //             })
    //         })
    //         if(res.ok) {
    //             console.log(res)
    //         } 
    //     } catch (error) {
    //         console.log(error)
    //     }
    //     setSaving(false)
    // }



//     const localCardsEl = localDeck.map((card, index) => 
//     <Card
//         key={`${card.id}${index}`}
//         {...card}
//     />
// )