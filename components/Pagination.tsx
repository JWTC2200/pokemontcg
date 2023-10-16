"use client"

import {useState} from 'react'
import { FaGreaterThan, FaLessThan } from "react-icons/fa"

type TPagination = {
    pageCount: number
    onPageChange: (e:number) => void
}

const Pagination = ({pageCount, onPageChange}:TPagination) => {

    const [activePage, setActivePage] = useState(0)    

    const pageCountArray = [...Array(pageCount).keys()].map(num => String(num))
    if (!pageCount) {
        return null
    }

    const sortedPages = pageCountArray.filter(page => {
        if ( page === "0" || Number(page) === pageCount - 1 || Number(page) === activePage || Number(page) === activePage - 1 || Number(page) === activePage + 1  || Number(page) === activePage + 2  || Number(page) === activePage - 2) {
            return page
        }
    })

    return (
        <ul  
            className='flex gap-2 text-black items-center font-semibold lg:text-2xl cursor-pointer'          
        >
            <li                
                onClick={activePage > 0 
                    ? ()=>{
                        onPageChange(activePage - 1)
                        setActivePage(prev => prev - 1)
                    }
                    : ()=>{}
                }
            >
                <FaLessThan/>
            </li>
                {sortedPages.map(page => {
                    const active = page === String(activePage) ? "underline" : ""    
                    return  (
                        <li
                            key={page}
                            onClick={()=>{
                                onPageChange(Number(page))
                                setActivePage(Number(page))
                            }}
                            className={`hover:text-red-400  ${active}`}
                        >{Number(page) + 1}</li>  
                    )}  
                )}
            <li
                onClick={activePage <= (pageCount - 2) 
                    ? ()=>{
                        onPageChange(activePage + 1)
                        setActivePage(prev => prev + 1)
                    }
                    : ()=>{}
                }
            >
                <FaGreaterThan/>
            </li>
        </ul>
    )
}

export default Pagination