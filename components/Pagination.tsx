"use client"

import {useState} from 'react'
import { FaGreaterThan, FaLessThan } from "react-icons/fa"

type TPagination = {
    pageCount: number
    onPageChange: (e:number) => void
}

const Pagination = ({pageCount, onPageChange}:TPagination) => {

    const [activePage, setActivePage] = useState(1)    

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
            className='flex gap-2 text-black items-center font-semibold lg:text-xl cursor-pointer'          
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
                {sortedPages.map(page => 
                    <li
                        key={page}
                        onClick={()=>{
                            onPageChange(Number(page))
                            setActivePage(Number(page))
                        }}
                        className={page === String(activePage) ? "underline" : ""}
                    >{Number(page) + 1}</li>    
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