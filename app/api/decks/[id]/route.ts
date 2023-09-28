import supabase from "@/app/utils/supabase";

export const GET = async (req: Request, {params}: {params:{id:string}}) => {
    try {
        console.log("get user decks")
        const { data } = await supabase.from("decktable").select().eq("owner", params.id)
        return new Response(JSON.stringify(data), {status: 201})
    } catch (error) {
        console.log(error)
    }
}