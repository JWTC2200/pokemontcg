import supabase from "@/app/utils/supabase";

export const GET = async (req: Request, {params}: {params:{id:string}}) => {
    console.log("get one")
    try {
        const { data } = await supabase.from("decktable").select().eq("id", "34edce1d-96bc-434c-98f2-5b9ee541308c")
        return new Response(JSON.stringify(data), {status: 201})
    } catch (error) {
        console.log(error)
    }
}