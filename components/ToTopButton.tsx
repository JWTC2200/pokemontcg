"use client"

import {useEffect, useState} from 'react'
import { BiSolidToTop } from "react-icons/bi"

const ToTopButton = () => {
    const [scrollVis, setScrollVis] = useState(false)

    useEffect(()=> {
      const handleScrollVis = ()=> {
        window.scrollY > screen.height ? setScrollVis(true) : setScrollVis(false)
      }
      window.addEventListener("scroll", handleScrollVis)
      return ()=> {
        window.addEventListener("scroll", handleScrollVis)
      }
    },[])

    return (
        <button 
            type="button"
            className={`z-50 fixed text-4xl bg-slate-800 rounded-full p-1 right-8 bottom-12 ${scrollVis ? "": "hidden"}`}
            onClick={()=>window.scrollTo({top:0, behavior:"smooth"})}
        >
            <BiSolidToTop/>
        </button> 
    )
}

export default ToTopButton