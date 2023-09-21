import Link from "next/link"

const Footer = () => {
  return (
    <footer className="w-full max-w-screen-2xl bg-slate-800 bg-opacity-75 mt-auto py-12 flex justify-center">
        <p>Made using the 
            <Link 
                href="https://docs.pokemontcg.io/"
                className="text-emerald-400 ml-1 underline"
            >
                PokemonTCG API
            </Link>
        </p>
    </footer>
  )
}

export default Footer