import supabase from "@/app/utils/supabase";

export const dynamic = "force-dynamic"

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
     const {id, deckname, cards } = await req.json()
     try {
        console.log("updating deck")
        const { error } =  await supabase.from("decktable").update({deckname: deckname, cards: cards}).eq("id", id)
        return new Response(JSON.stringify(error), {status: 201})
     } catch (error) {
        console.log(error)
    }
}

export const DELETE = async (req: Request) => {
    const { id } = await req.json()
    console.log(id)
    try {
        console.log("deleting deck")
        const { error } = await supabase.from("decktable").delete().eq("id", id)
        return new Response(JSON.stringify(error), {status: 201})
    } catch (error) {
        console.log(error)
    }
}