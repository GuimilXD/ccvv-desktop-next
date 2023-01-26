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
