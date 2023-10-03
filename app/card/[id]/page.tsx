"use client"

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'
import Link from 'next/link'
import { typeColors } from '@/data/carddata'
import { energySymbols } from '@/app/utils/energyTypes'
import { FaExternalLinkAlt } from "react-icons/fa"
import addToDeck from '@/app/utils/deckstorage'

type cardRegMark = PokemonTCG.Card & {regulationMark: string}

const SingleCard = () => {

    const { id } = useParams()
    const [cardData, setCardData] = useState<cardRegMark|null>(null)
    
    useEffect(()=> {
        const getSingleCard = async () => {
            try {
                const res = await fetch(`/api/cards/${id}`)
                const data:cardRegMark = await res.json()
                setCardData(data)
            } catch (error) {
                console.log(error)
            }
        }
        getSingleCard()
    }, [])

    let headingStyles = "bg-gray-200 text-black "

    if(cardData?.types != undefined) {
        for (let i=0; i < typeColors.length; i++) {
            if (typeColors[i].type === cardData.types[0]) {
                headingStyles = typeColors[i].styles
            }
        }
    }

    return (
        <section className='page_container'>
            {cardData
            ? <div className="flex flex-col lg:flex-row w-full gap-8 px-2 sm:px-8 lg:px-0 xl:px-4 2xl:px-12">
                <section className="w-full flex flex-col justify-center items-center bg-gray-200 bg-opacity-10 rounded-lg">
                    <Link
                        href={`/search?name=${cardData.name}`}
                    >
                        <img 
                            src={cardData.images.large} 
                            className="w-96 p-4"
                        />
                    </Link>                
                </section>
                <section className="w-full text-slate-900">
                    <h1 className={`${headingStyles} py-6 pl-8 rounded-t-lg text-3xl font-bold flex items-center lg:mt-4`}>
                                               
                        {cardData.name}
                    </h1>
                    <section className="flex justify-between px-4 py-2 bg-white">
                        <p>{cardData.subtypes ? cardData.subtypes[0] : null} {cardData.supertype}</p>
                        {cardData.hp 
                            ? <p>{cardData.hp}HP</p>
                            : null
                        }                        
                    </section>
                    {cardData.evolvesFrom || cardData.evolvesTo 
                        ? <section className="px-4 py-2 bg-white">
                            {cardData.evolvesFrom 
                                ? <p>Evolves from: <Link 
                                    className="underline hover:font-semibold"
                                    href={`/search?name=${cardData.evolvesFrom}`}
                                >
                                    {cardData.evolvesFrom}
                                </Link></p> 
                                : null 
                            }
                            {cardData.evolvesTo 
                                ? <p>Evolves from: <Link 
                                    className="underline hover:font-semibold"
                                    href={`/search?name=${cardData.evolvesTo}`}
                                >
                                    {cardData.evolvesTo}
                                </Link></p> 
                                : null 
                            }
                        </section>
                        : null                    
                    }
                    {cardData.rules 
                        ? <section className="bg-white px-4 py-2">
                            {cardData.rules.map(rule => {
                                const splitRuleText = rule.split(":")
                                return (
                                    <h3 
                                        key={rule} 
                                        className='mb-2'
                                    >
                                        <span className='font-bold'>{splitRuleText[0]}</span>
                                        {splitRuleText[1]}
                                    </h3>
                                )
                            }                                  
                        )}
                        </section>
                        : null
                    }

                    <section className="bg-white px-4 py-2 flex flex-col gap-4">
                        {cardData.abilities
                            ? cardData.abilities.map(ability => 
                                <div key={ability.name}>
                                    <h3 className='font-bold text-lg'><span className='italic'>{ability.type} </span>: {ability.name}</h3>
                                    <p></p>
                                    <p>{ability.text}</p>
                                </div>
                            )
                            : null
                        }
                        {cardData.attacks?.map(attack => 
                            <div key={attack.name}>
                                <div className='flex justify-between items-center'>
                                    <div className='flex gap-1'>
                                        {attack.cost.map(energy=>energySymbols(energy))}
                                    </div>
                                    <h3 className='font-bold text-lg'>{attack.name}</h3>
                                    <p className='mr-4 font-bold'>{attack.damage}</p>
                                </div>
                                <p>{attack.text}</p>                                
                            </div>    
                        )}
                    </section>
                    <section className="bg-white px-4 py-2 flex flex-col gap-4">
                        {cardData.weaknesses || cardData.resistances || cardData.retreatCost 
                            ? <section className='flex justify-between'>
                                <div className='flex flex-col items-center'>
                                    <h3 className='text-lg font-bold'>Weakness</h3>
                                    {cardData.weaknesses
                                        ? <div className='flex items-center'>
                                            {energySymbols(cardData.weaknesses[0].type)}
                                            <span className='ml-1 font-semibold'>{cardData.weaknesses[0].value}</span>
                                        </div>
                                        : <div>None</div>
                                    }
                                </div>
                                <div className='flex flex-col items-center'>
                                    <h3 className='text-lg font-bold'>Resistance</h3>
                                    {cardData.resistances
                                        ? <div className='flex items-center'>
                                            {energySymbols(cardData.resistances[0].type)}
                                            <span className='ml-1 font-semibold'>{cardData.resistances[0].value}</span>
                                        </div>
                                        : <div>None</div>                                   
                                    }
                                </div>
                                <div className='flex flex-col items-center'>
                                    <h3 className='text-lg font-bold'>Retreat</h3>
                                    {cardData.retreatCost 
                                        ?   <div className='flex items-center'>
                                            {cardData.retreatCost.map((energy) => energySymbols(energy))}
                                            </div>
                                        : <div>None</div>
                                    }
                                </div>
                            </section>
                            : null
                        }
                    </section>   
                    <section className="bg-gray-100 bg-opacity-20 px-4 py-2 flex flex-col gap-1 rounded-b-lg">
                        {cardData.artist 
                            ? <p className='font-medium'>Illustrator: <span className='italic'>{cardData.artist}</span></p>
                            : null
                        }
                        <Link
                            href={`/search?setname=${cardData.set.name.replace("&", "%26")}&series=${cardData.set.series.replace("&", "%26")}`}
                            className='hover:text-orange-800 hover:underline flex gap-2 items-center'
                        >
                            {cardData.set.series}: {cardData.set.name} <FaExternalLinkAlt/>
                        </Link>
                        <div className='flex items-center gap-2'>
                            <img className="h-8" src={cardData.set.images.symbol}/>
                            {cardData.regulationMark 
                                ? <span className="px-1 text-lg border-2 border-black rounded-lg bg-white font-semibold">
                                    {cardData.regulationMark}
                                </span>
                                : null
                            } 
                            <p>{cardData.number}/{cardData.set.printedTotal} {cardData.rarity}</p>
                        </div>                        
                    </section>                 
                </section>
            </div>
            : null
            
        
            }
        </section>
    )
}

export default SingleCard