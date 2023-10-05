import supabase from "@/app/utils/supabase";

export const dynamic = "force-dynamic"
export const revalidate = 0


export const POST = async (req: Request) => {
    const {deckname, owner, cards } = await req.json()
    try {
        console.log("Add deck to database")
        const { data , error } = await supabase.from("decktable").insert({owner: owner, cards: cards, deckname: deckname }).select()
        return new Response(JSON.stringify({data, error}), {status: 201})
    } catch (error) {
        console.log(error)
    }
}

export const PUT = async (req: Request) => {
     const {id, deckname, cards, owner } = await req.json()
     try {
        console.log("updating deck")
        const { error } =  await supabase.from("decktable").update({deckname: deckname, cards: cards}).eq("id", id).eq("owner",owner)
        return new Response(JSON.stringify(error), {status: 201})
     } catch (error) {
        console.log(error)
    }
}

export const DELETE = async (req: Request) => {
    const { id, owner } = await req.json()
    console.log(id)
    try {
        console.log("deleting deck")
        const { error } = await supabase.from("decktable").delete().eq("id", id).eq("owner", owner)
        return new Response(JSON.stringify(error), {status: 201})
    } catch (error) {
        console.log(error)
    }
}