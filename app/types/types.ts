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
    name: string,
    mark: string | null
}