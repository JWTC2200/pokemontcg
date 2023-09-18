import Link from "next/link"
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'

const Card = ({images, id, name, set}: PokemonTCG.Card) => {
  return (
    <Link
        href={`/card/${id}`} 
    >
        <img
            src={images.small}
            className='cursor-pointer'
            onClick={()=>{console.log(id)}}
        />
    </Link>
        
  )
}

export default Card