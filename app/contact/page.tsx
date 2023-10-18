"use client"

import { useState, useEffect } from "react"
import { ContactFormData  } from "../types/types"
import { useRouter } from "next/navigation"
import { useUser } from "@auth0/nextjs-auth0/client"

const page = () => {

    const [emailSuccess, setEmailSuccess] = useState(false)
    const router = useRouter()
    const { user } = useUser()

    const [formData, setFormData] = useState<ContactFormData>({
        email: "",
        message: ""
    })

    useEffect(()=>{
        const setEmail = ()=> {
            if (user) {
                if (user.email) {
                    setFormData(prev => {
                        return (
                            {...prev, email:user.email!}
                        )
                    })
                }
            }
        }
        setEmail()
    },[user])

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        setFormData(prev => {
            return (
                {...prev, [e.target.name]:e.target.value}
            )
        })
    }

    const handleFormSubmit = async (e:React.SyntheticEvent) => {
        e.preventDefault()
        setEmailSuccess(false)
        try {
            const res = await fetch('api/send', {
                method: "POST",
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            console.log(data)
            if( data.id ) {
                setEmailSuccess(true)
                setTimeout(()=>{router.replace("/")}, 2000)
            } 
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <main className="page_container text-black justify-center items-center sm:justify-start sm:items-start">
            <p className="max-w-sm">  If you have any suggestions, requests or found any bugs feel free to let me know. Any and all feedback is really appreciated!</p>
            <form
                className="flex flex-col justify-start items-start w-full max-w-sm mt-4"
                onSubmit={handleFormSubmit}
            >
                <label 
                    htmlFor="email" 
                    className="pl-2 mt-2"
                >
                    Email
                </label>
                <input
                    className="min-w-full placeholder-gray-400 pl-2"
                    required
                    name="email"
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="Email"
                />
                <textarea
                    className="min-w-full mt-4 placeholder-gray-400 pl-2"
                    required
                    name="message"
                    id="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    rows={10}
                    placeholder="Mesage"
                />
                <button 
                    type="submit" 
                    className='text-white text-xl bg-black ml-2 px-3 py-1 rounded-xl gap-2 flex items-center cursor-pointer mt-4'
                >
                    Submit
                </button>
            </form>
            {emailSuccess 
                ? <h4 className="max-w-sm text-green-700 mt-4">Message sent! Thank you for your feedback. You will now be redirected to the front page.</h4>
                : null
            }
        </main>
    )
    }

export default page