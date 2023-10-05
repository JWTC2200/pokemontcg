import Link from "next/link"

const Footer = () => {
  return (
    <footer className="w-full max-w-screen-2xl bg-slate-800 bg-opacity-75 mt-auto py-12 flex flex-col items-center justify-center">
        <p>Data from the 
            <Link 
                href="https://pokemontcg.io/"
                className="text-emerald-400 ml-1 underline hover:text-red-400"
            >
                PokemonTCG API
            </Link>
        </p>
        <p>
          Using 
            <Link
              href="https://auth0.com/"
              className="text-emerald-400 ml-1 underline mr-1 hover:text-red-400"
            >
              Auth0 
            </Link>
          authentication
        </p>
        <p>
          Backend by
          <Link
            href="https://supabase.com/"
            className="text-emerald-400 ml-1 underline mr-1 hover:text-red-400"
          >
            Supabase
          </Link>
        </p>
    </footer>
  )
}

export default Footer