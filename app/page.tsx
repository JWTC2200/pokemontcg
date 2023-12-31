"use client"

import { useUser } from "@auth0/nextjs-auth0/client"
import Link from "next/link"

export default function Index() {

  const { user } = useUser()

  return (
    <main className="page_container text-slate-600">
      <section className="max-w-3xl flex flex-col justify-center items-start">
        <h1 className="text-3xl font-extrabold self-center">
          Welcome{user?.name ? " " + user.name : null}, to the PTCG Deckbuilder! 
        </h1>

        <p className="text-xl mt-8">This site allows you to search for any card from the Pokemon Trading Card Game and build decks with them. </p>
        <p className="text-xl mt-8">Cards can be searched by name, type or set. Advanced search allows searching by energy type, rarity, regulation mark or subtype. With more to be added over time.</p>
        { user 
          ? <p className="text-xl mt-8">
            For now please
            <Link
              href="/search"
              className="underline mx-1 hover:text-orange-700"
            >
              click here
            </Link> 
            to get started!
          </p>
          : <p className="text-xl mt-8">
            Please 
            <Link
              href="/api/auth/login"
              className="underline mx-1 hover:text-orange-700"
            >
              login
            </Link>
              to get started!
            </p>
        }

      </section>
      
    </main>
  )
}