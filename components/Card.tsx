import Link from "next/link"
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'

const Card = ({images, id}: PokemonTCG.Card) => {
  return (
    <Link
      className=""
      href={`/card/${id}`} 
    >
      <img
          src={images.small}
          className='cursor-pointer hover:scale-110 card_outline w-40'
      />
    </Link>
        
  )
}

export default Card