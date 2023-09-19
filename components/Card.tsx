import Link from "next/link"
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'

const Card = ({images, id, name, set}: PokemonTCG.Card) => {
  return (
    <Link
        href={`/card/${id}`} 
    >
        <img
            src={images.small}
            className='cursor-pointer hover:scale-150 card_outline w-52'
            onClick={()=>{console.log(id)}}
        />
    </Link>
        
  )
}

export default Card