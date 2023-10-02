import supabase from "@/app/utils/supabase";

export const GET = async (req: Request, {params}: {params:{id:string}}) => {
    console.log("get single deck data")
    try {
        const { data } = await supabase.from("decktable").select().eq("id", params.id)
        return new Response(JSON.stringify(data), {status: 201})
    } catch (error) {
        console.log(error)
    }
}