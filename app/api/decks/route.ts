import supabase from "@/app/utils/supabase";

export const POST = async (req: Request) => {
    const {deckname, owner, cards } = await req.json()
    try {
        console.log("Add deck to database")
        const { error } = await supabase.from("decktable").insert({owner: owner, cards: cards, deckname: deckname })
        return new Response(JSON.stringify(error), {status: 201})
    } catch (error) {
        console.log(error)
    }
}