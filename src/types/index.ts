export interface SuggestItem {
    alias: string,
    type: 'user' | 'company',
    name?: string,
    avatar?: string
}

export interface ResponseApiFromHabr {
    data: SuggestItem[],
}