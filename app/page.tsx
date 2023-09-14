"use client"

import { useUser } from "@auth0/nextjs-auth0/client"

export default function Index() {

  const { user } = useUser()

  return (
    <section className="w-full max-w-screen-2xl h-screen min-h-full bg-slate-500 bg-opacity-30 flex flex-col items-center pt-4 px-4">
      <h1 className="text-3xl font-extrabold">
        Welcome{user?.name ? " " + user.name : null}, to the Pokemon Deckbuilder! 
      </h1>
    </section>
  )
}