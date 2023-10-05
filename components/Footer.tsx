import Link from "next/link"

const Footer = () => {
  return (
    <footer className="w-full max-w-screen-2xl bg-slate-800 bg-opacity-75 mt-auto py-12 flex flex-col items-center justify-center">
      <div>
        
        <p>Data from the 
            <Link 
                href="https://pokemontcg.io/"
                className="text-emerald-400 ml-1 underline hover:text-red-400"
            >
                PokemonTCG API
            </Link>
        </p>
        <p>
          Site uses 
            <Link
              href="https://auth0.com/"
              className="text-emerald-400 ml-1 underline mr-1 hover:text-red-400"
            >
              Auth0 
            </Link>
          authentication and
          <Link
            href="https://supabase.com/"
            className="text-emerald-400 mx-1 underline hover:text-red-400"
          >
            Supabase
          </Link>
        </p>
        <p>
          PTCG Deckbuilder by 
          <Link
            href="https://jwtc2200.netlify.app/"
            className="text-emerald-400 ml-1 underline hover:text-red-400"
          >
            Jun Chan 
          </Link>
        </p>
        <p>
          Take a look at my
          <Link
            href="https://github.com/JWTC2200/pokemontcg"
            className="text-emerald-400 ml-1 underline hover:text-red-400"
          >
            Github!
          </Link>
        </p>
        <p>This website is not affiliated with The Pokémon Company in any way</p>
      </div>
    </footer>
  )
}

export default Footer