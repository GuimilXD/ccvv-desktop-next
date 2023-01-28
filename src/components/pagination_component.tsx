import { Table } from "@tanstack/react-table"

export interface PaginationComponent<T> {
    table: Table<T>,
    pageIndex: number
}
export default function PaginationComponent({ table, pageIndex }: PaginationComponent<any>) {
    return (

        <nav className="pagination" role="navigation" aria-label="pagination">
            <a
                onClick={() => table.previousPage()}
                className="pagination-previous">
                Anterior
            </a>
            <a
                onClick={() => table.nextPage()}
                className="pagination-next">
                Próxima
            </a>
            <ul className="pagination-list">
                {Array.from({ length: table.getPageCount() }, (_, i) => i + 1).map((page: number) =>
                    <li key={page}>
                        <a
                            className={`pagination-link ${page == pageIndex + 1 ? "is-current" : ""}`}
                            onClick={() => table.setPageIndex(page - 1)}
                            aria-current="page">
                            {page}
                        </a>
                    </li>
                )}
            </ul>
        </nav>
    )
}
