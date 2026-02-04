'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
} from './Dropdown';

export interface PagerProps {
    page: number;
    limit: number;
    total: number;
    changePage: (arg: number) => void;
    changeLimit: (arg: number) => void;
    limitOptions?: number[];
}

function canChangePage(newPage: number, limit: number, total: number): boolean {
    if (newPage < 0 || total == 0) return false;
    if (newPage * limit >= total && total > 0) return false;
    return true;
}

export default function Pager({
    page,
    limit,
    total,
    changePage,
    changeLimit,
    limitOptions = [5, 10, 15],
}: PagerProps) {
    const startItem = page * limit + 1;
    const endItem = Math.min((page + 1) * limit, total);

    return (
        <div className="bg-sarge-gray-0 border-sarge-gray-200 flex items-center rounded-lg border-1">
            <div className="flex-1">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="bg-sarge-gray-0 hover:bg-sarge-gray-100 border-sarge-gray-200 flex cursor-pointer items-center gap-2 rounded-l-lg border-r-1 px-3 py-2">
                            <span className="text-sarge-gray-800 text-sm font-medium">
                                {startItem}-{endItem} of {total}
                            </span>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        {limitOptions.map((option) => (
                            <DropdownMenuCheckboxItem
                                key={option}
                                checked={limit === option}
                                onCheckedChange={() => changeLimit(option)}
                            >
                                {option} per page
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="bg-sarge-gray-0 flex rounded-r-lg">
                <Button
                    variant="secondary"
                    onClick={() => canChangePage(page - 1, limit, total) && changePage(page - 1)}
                    disabled={!canChangePage(page - 1, limit, total)}
                    className="bg-sarge-gray-0 size-9 rounded-lg border-none"
                >
                    <ChevronLeft className="size-4 !text-black" />
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => canChangePage(page + 1, limit, total) && changePage(page + 1)}
                    disabled={!canChangePage(page + 1, limit, total)}
                    className="bg-sarge-gray-0 size-9 border-none"
                >
                    <ChevronRight className="size-4 !text-black" />
                </Button>
            </div>
        </div>
    );
}
