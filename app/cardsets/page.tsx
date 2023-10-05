"use client"

import { useState, useContext} from 'react'
import Link from 'next/link'
import { CardSetContext } from '@/components/SetContext'
import Switch from "react-switch"
import { BsFillGridFill, BsTable } from "react-icons/bs"

const CardSets = () => {

    const AllCardSets = useContext(CardSetContext)
    const sortedSets = AllCardSets.sort((a,b)=> {
        return Number(new Date(b.releaseDate)) - Number(new Date(a.releaseDate))})
    const sortedSeries = Array.from(new Set(sortedSets.map(set => set.series)))

    const [viewMode, setViewMode] = useState(true)

    const setIconGridEl = sortedSeries.map(series => {
        const seriesSets = sortedSets.filter(set => set.series === series)
        return (
            <div key={series} className='flex flex-col bg-white mb-4 pb-2 rounded-xl bg-opacity-75'>                
                <h3 
                    className='text-3xl font-bold self-center my-2 font-rye'
                >
                    {series}
                </h3>
                <hr className='bg-black border-0 h-px mx-12 md:mx-20 mb-4'/>
                <div 
                    className='flex md:gap-4 gap-2 flex-wrap items-center justify-center pb-6'
                >
                    {seriesSets.map(set => 
                        <Link 
                            key={set.name+set.series}
                            href={`/search?setname=${set.name.replace("&", "%26")}&series=${set.series.replace("&", "%26")}`}
                            className='hover:scale-110 w-60 h-40 p-2 bg-slate-200 rounded-2xl'
                        >   
                            <div className='flex flex-col justify-center items-center text-center'>
                                <img 
                                    src={set.images.logo} 
                                    className='h-20 mb-2 object-contain' 
                                    alt={`${set.name} logo`}
                                />
                                <h3 className='font-changa text-lg'>{set.name}</h3>
                            </div>                            
                        </Link>
                    )}
                </div>
            </div>
        )
    })

    const setIconTableEl = sortedSeries.map(series => {
        const seriesSets = sortedSets.filter(set => set.series === series)
        const setTableEl = seriesSets.map(set => 
            <tr key={set.name+set.series} className='even:bg-gray-300 odd:bg-white py-1'>
                <td className='w-12 pl-2'><img src={set.images.symbol} className='h-8' alt={`${set.name} icon`}/></td>
                <td className='w-52'>
                    <Link 
                        href={`/search?setname=${set.name.replace("&", "%26")}&series=${set.series.replace("&", "%26")}`}
                        className='hover:text-red-500'
                    >
                        {set.name}
                    </Link>
                </td>
                <td className='w-22 pr-2'>{set.printedTotal} cards</td>
            </tr>
        )
        return (
            <table key={series}>
                <thead className="text-2xl bg-gray-800 text-white font-rye h-16">
                    <tr>
                        <th colSpan={3} >{series}</th>
                    </tr>
                </thead>
                <tbody>
                    {setTableEl}
                </tbody>
            </table>
            
        )
    })

    return (
        <section className='page_container text-black'>
            <div className='flex gap-1 self-start justify-self-start items-center mb-4 ml-8'>
                <Switch  
                    onChange={()=>{setViewMode(prev => !prev)}} 
                    checked={viewMode} 
                    checkedIcon={<BsTable className="w-full h-full p-1 text-white"/>}
                    uncheckedIcon={< BsFillGridFill className="w-full h-full p-1 text-white"/>}
                />
            </div>  
            {!viewMode 
                ? <div>{setIconGridEl}</div>
                : <div className='flex flex-wrap items-start justify-center sm:gap-2 gap-4'>{setIconTableEl}</div>
            }                         
        </section>
    )
}

export default CardSets