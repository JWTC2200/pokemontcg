export type TCardData = [] |
    [
        {
            id: string,
            images: {
                small: string,
                large: string
            }
        }
    ]

export type TQuery = {
    name: string
    regulationMark: string
    subtypes: string
    rarity: string
    supertype: string
    types: string
    "set.series": string,
    "set.name": string,
} 
