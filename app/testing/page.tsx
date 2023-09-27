"use client"

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const TestingPage = () => {

    const [formData, setFormData] = useState("")
    const params = new URLSearchParams()
    const router = useRouter()
    const searchParams = Array.from(useSearchParams().entries())

    const addParams = (type:string, value:string)=>{
        params.set(type, value)
    }

    const onSubmit = async ()=>{
        try {
            await fetch("api/testing?name=pikachu&set=hello")
        } catch (error) {
            
        }
    }

    return (
        <div className='flex flex-col gap-2 mt-12'>
            <button className="red_btn" onClick={()=>addParams("name", "squirtle")}>
                test 1
            </button>
            <button className="red_btn" onClick={()=>addParams("type", "blastoise")}>
                test 1
            </button>
            <button className='red_btn' onClick={()=>onSubmit()}>
                SUBMIT
            </button>
        </div>
    )
}

export default TestingPage