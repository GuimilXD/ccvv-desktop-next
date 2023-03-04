import { Person } from "@/models";
import { personDefaultColumns, personColumnHelper } from "@/helpers";
import Link from "next/link";
import { ArrowUturnRightIcon, BackspaceIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import TableComponent from "./table_component";

export interface PeopleTableComponentProps {
    people: Person[],
    remove_from_path: string,
}

export default function PeopelTableComponent({ people, remove_from_path }: PeopleTableComponentProps) {
    const peopleTableColumns = [
        ...personDefaultColumns,
        personColumnHelper.display({
            header: "Ações",
            cell: (props) => (
                <div>
                    <Link href={`/people/${props.cell.row.getValue("id")}`}>
                        <ArrowUturnRightIcon className="icon" />
                    </Link>
                    <Link href={`/people/${props.cell.row.getValue("id")}/edit`}>
                        <PencilSquareIcon className="icon" />
                    </Link>
                    <Link href={`${remove_from_path}?person_id=${props.cell.row.getValue("id")}`}>
                        <BackspaceIcon className="icon" />
                    </Link>
                </div>
            ),
        }),
    ]

    const peopleTable = useReactTable({
        data: people,
        columns: peopleTableColumns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <TableComponent table={peopleTable} />
    )
}
