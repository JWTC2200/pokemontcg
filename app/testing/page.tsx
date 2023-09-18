"use client"

import { listOfAllSetsData } from "../data/sets"
import Link from "next/link"

const Testing = () => {

    const setSeries: string[] = Array.from(new Set(listOfAllSetsData.map(set => set.series)))

    const seriesGroups = setSeries.map(series => {
        return [series, 
            listOfAllSetsData.filter(set => 
                set.series === series
                )
        ]
    })

    console.log(seriesGroups)

    const listEl = seriesGroups.map(series => {
        const setEl = series[1].map(set => {
            return (
                <p key={set.id}>{set.name}</p>
            )
        })
        return (
            <div 
                key={series[0]}
                className=""
            >
                <h1>{series[0]}</h1>
                {setEl}
            </div>
        )
    })

    return (
        <div >
            <Link
                href="?name=testing"
                className="red_btn"
                type="button"
                onClick={()=>{console.log(123)}}
            >TESTING</Link>
            <Link
                href="?name=tsol"
                className="red_btn"
                type="button"
                onClick={()=>{console.log(123)}}
            >TESTING</Link>
            <div className="flex gap-6 flex-wrap">{listEl}</div>
        </div>
        
    )
}

export default Testing