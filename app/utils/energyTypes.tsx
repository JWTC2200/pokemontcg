import { nanoid } from "nanoid"

const typeSymbols = [
    {type:"Colorless", source:"eIconColorless.png"},
    {type:"Darkness", source:"eIconDarkness.png"},
    {type:"Dragon", source:"eIconDragon.png"},
    {type:"Fairy", source:"eIconFairy.png"},
    {type:"Fighting", source:"eIconFighting.png"},
    {type:"Fire", source:"eIconFire.png"},
    {type:"Grass", source:"eIconGrass.png"},
    {type:"Lightning", source:"eIconLightning.png"},
    {type:"Metal", source:"eIconMetal.png"},
    {type:"Psychic", source:"eIconPsychic.png"},
    {type:"Water", source:"eIconWater.png"},
]

export const energySymbols = (type:string)=>{
    const match = typeSymbols.filter(symbol => symbol.type === type)
    if(match.length) {
        return <img 
            key={nanoid()}
            src={`/assets/images/${match[0].source}`}
            alt={match[0].type}
            className="h-5 w-5"
        />
    }
}