export interface Person {
    id?: number,
    first_name: string,
    last_name: string,
    email?: string,
    phone_number?: string,
    details?: string,
}

export interface ListPeopleFilter {
    first_name?: string,
    last_name?: string
}

export interface ListPeopleCriteria {
    page: number,
    per_page: number,
    filter?: ListPeopleFilter
}

export interface ListPeopleWithTotalCount {
    people: Person[],
    total_count: number
}

export interface Modality {
    id?: number,
    name: string,
    description?: string
}

export interface ListModalitiesFilter {
    name?: string
}

export interface ListModalitiesCriteria {
    page: number,
    per_page: number,
    filter?: ListModalitiesFilter
}

export interface ListModalitiesWithTotalCount {
    modalities: Modality[],
    total_count: number
}

export interface Class {
    id?: number,
    name: string,
    description?: string
}

export interface ListClassesFilter {
    name?: string
}

export interface ListClassesCriteria {
    page: number,
    per_page: number,
    filter?: ListClassesFilter
}

export interface ListClassesWithTotalCount {
    classes: Class[],
    total_count: number
}
