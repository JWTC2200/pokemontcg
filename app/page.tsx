"use client"

import { useUser } from "@auth0/nextjs-auth0/client"
import { findCard } from "./pokemon/pokemon"
import { useRouter } from "next/router"
import Link from "next/link"
import React from "react"


export default function Index() {

  const { user } = useUser()

  return (
    <section className="w-full max-w-screen-2xl h-full bg-slate-500 bg-opacity-30 flex flex-col items-center pt-4 px-4">
      <h1 className="text-3xl font-extrabold">
        Welcome{user?.name ? " " + user.name : null}, to the Pokemon Deckbuilder! 
      </h1>
      { user 
        ? <Link
            href="/search"
            className="red_btn"
          >
            Search
          </Link>
        : null
      }
    </section>
  )
}