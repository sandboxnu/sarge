'use client';

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
    type OnChangeFn,
    type RowSelectionState,
} from '@tanstack/react-table';
import { cn } from '@/lib/utils/cn.utils';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    headerClassName?: string;
    // Row selection is opt-in: tables that don't pass `rowSelection` behave as before
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: OnChangeFn<RowSelectionState>;
    getRowId?: (row: TData, index: number) => string;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    headerClassName,
    rowSelection,
    onRowSelectionChange,
    getRowId,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId,
        enableRowSelection: rowSelection !== undefined,
        onRowSelectionChange,
        state: rowSelection !== undefined ? { rowSelection } : {},
    });

    return (
        <div className="w-full overflow-y-auto">
            <table className="w-full">
                <thead className={cn('sticky top-0 z-10 bg-white', headerClassName)}>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="border-sarge-gray-200 border-b">
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="text-label-s text-sarge-gray-700 px-4 py-4 text-left font-bold"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="border-sarge-gray-200 border-b">
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="text-sarge-gray-800 px-4 py-4 text-sm"
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="text-sarge-gray-600 h-24 text-center"
                            >
                                No results.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
