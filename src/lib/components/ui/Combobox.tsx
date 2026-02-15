'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Search, Square, SquareCheck, Plus } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from 'cmdk';
import { Popover, PopoverContent, PopoverTrigger } from '@/lib/components/ui/Popover';
import { cn } from '@/lib/utils/cn.utils';

export interface ComboboxOption<T = string> {
    value: T;
    label: string;
}

export interface ComboboxProps<T = string> {
    options: ComboboxOption<T>[];
    value?: T | T[];
    onChange?: (value: T | T[]) => void;
    multiple?: boolean;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    className?: string;
    triggerClassName?: string;
    contentClassName?: string;
    disabled?: boolean;
    /** Render custom trigger (e.g. with chips). If not provided, uses default trigger. */
    trigger?: React.ReactNode;
    /** Custom getOptionLabel for non-string values */
    getOptionLabel?: (value: T) => string;
    /** 'check' uses Check icon (tags style), 'checkbox' uses Square/SquareCheck (languages style) */
    variant?: 'check' | 'checkbox';
    /** Show a "Select All" option at the top of the list (only for multiple) */
    showSelectAll?: boolean;
    /** Show a "Clear All" button in the default trigger (only for multiple) */
    showClearAll?: boolean;
    /** Callback when "Clear All" is clicked */
    onClearAll?: () => void;
    /** Callback to create a new option when search yields no matches */
    onCreateOption?: (search: string) => void;
    /** Show search icon in the search input row */
    showSearchIcon?: boolean;
    /** Max character length for the search input. Shows a counter and prevents exceeding. */
    maxLength?: number;
    /** Filter mode: 'contains' (default, substring match) or 'prefix' (starts-with match) */
    filterMode?: 'contains' | 'prefix';
}

function defaultGetLabel<T>(value: T, options: ComboboxOption<T>[]): string {
    const opt = options.find((o) => o.value === value);
    return opt?.label ?? String(value);
}

function ComboboxInner<T = string>({
    options,
    value,
    onChange,
    multiple = false,
    placeholder = 'Select...',
    searchPlaceholder = 'Search...',
    emptyText = 'No results found.',
    className,
    triggerClassName,
    contentClassName,
    disabled = false,
    trigger: customTrigger,
    getOptionLabel,
    variant = 'check',
    showSelectAll = false,
    showClearAll = false,
    onClearAll,
    onCreateOption,
    showSearchIcon = false,
    maxLength,
    filterMode = 'contains',
}: ComboboxProps<T>) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const [shakeKey, setShakeKey] = React.useState(0);
    const singleValue = Array.isArray(value) ? value[0] : value;
    const multiValues = Array.isArray(value) ? value : value != null ? [value] : [];
    const displayLabel = (v: T) =>
        getOptionLabel ? getOptionLabel(v) : defaultGetLabel(v, options);

    const handleSelect = (opt: ComboboxOption<T>) => {
        if (multiple) {
            const next = multiValues.includes(opt.value)
                ? multiValues.filter((x) => x !== opt.value)
                : [...multiValues, opt.value];
            onChange?.(next as T | T[]);
        } else {
            onChange?.(opt.value as T | T[]);
            setOpen(false);
        }
    };

    const handleSelectAll = () => {
        if (!multiple) return;
        const allSelected = options.every((opt) => multiValues.includes(opt.value));
        if (allSelected) {
            onChange?.([] as unknown as T[]);
        } else {
            onChange?.(options.map((o) => o.value) as T | T[]);
        }
    };

    const handleClearAll = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (onClearAll) {
            onClearAll();
        } else {
            onChange?.([] as unknown as T[]);
        }
    };

    const allSelected =
        multiple && options.length > 0 && options.every((opt) => multiValues.includes(opt.value));

    const hasSelections = multiValues.length > 0;

    const triggerLabel =
        multiple && multiValues.length > 0
            ? `${multiValues.length} selected`
            : singleValue != null
              ? displayLabel(singleValue)
              : placeholder;

    const renderSelectionIcon = (selected: boolean) => {
        if (variant === 'checkbox') {
            return selected ? (
                <SquareCheck className="text-sarge-primary-500 mr-2 size-5" />
            ) : (
                <Square className="text-sarge-gray-600 mr-2 size-5" />
            );
        }
        return <Check className={cn('mr-2 size-4', selected ? 'opacity-100' : 'opacity-0')} />;
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {customTrigger ?? (
                    <button
                        type="button"
                        disabled={disabled}
                        className={cn(
                            'border-sarge-gray-200 bg-sarge-gray-50 text-sarge-gray-800 placeholder:text-sarge-gray-500 focus:ring-sarge-primary-500 flex min-h-11 w-full items-center rounded-lg border py-3 pr-3 pl-4 text-sm focus:ring-2 focus:outline-none focus:ring-inset disabled:cursor-not-allowed disabled:opacity-50',
                            triggerClassName,
                            className
                        )}
                    >
                        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                            <span className="text-label-s text-sarge-gray-500 truncate">
                                {triggerLabel}
                            </span>
                        </div>
                        {showClearAll && multiple ? (
                            <span
                                role="button"
                                tabIndex={0}
                                onClick={handleClearAll}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleClearAll(e as unknown as React.MouseEvent);
                                    }
                                }}
                                className={cn(
                                    'text-label-xs ml-2 shrink-0 whitespace-nowrap',
                                    hasSelections
                                        ? 'text-sarge-primary-600 hover:text-sarge-primary-700 cursor-pointer'
                                        : 'text-sarge-gray-300 cursor-default'
                                )}
                            >
                                Clear All
                            </span>
                        ) : (
                            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        )}
                    </button>
                )}
            </PopoverTrigger>
            <PopoverContent
                className={cn(
                    'bg-sarge-gray-0 border-sarge-gray-200 w-[var(--radix-popover-trigger-width)] rounded-lg border p-1 shadow-[0px_8px_24px_-4px_rgba(0,0,0,0.12)]',
                    contentClassName
                )}
                align="start"
            >
                <Command
                    className="rounded-lg border-0 bg-transparent shadow-none [&_[cmdk-input-wrapper]]:border-0 [&_[cmdk-input-wrapper]]:p-0"
                    shouldFilter={true}
                    {...(filterMode === 'prefix' && {
                        filter: (value: string, search: string) =>
                            value.toLowerCase().startsWith(search.toLowerCase()) ? 1 : 0,
                    })}
                >
                    <div className="bg-sarge-gray-50 border-sarge-gray-100 mx-0 mb-1 flex items-center rounded-lg border px-3 py-2">
                        {showSearchIcon && (
                            <Search className="text-sarge-gray-500 mr-2 size-5 shrink-0" />
                        )}
                        <CommandInput
                            placeholder={searchPlaceholder}
                            className="text-label-s text-sarge-gray-800 placeholder:text-sarge-gray-500 h-auto w-full border-0 bg-transparent p-0 shadow-none outline-none placeholder:italic focus:ring-0 focus:outline-none"
                            value={search}
                            onValueChange={(val) => {
                                if (maxLength && val.length > maxLength) {
                                    setShakeKey((k) => k + 1);
                                    return;
                                }
                                setSearch(val);
                            }}
                        />
                        {maxLength && (
                            <span
                                key={shakeKey}
                                className={cn(
                                    'text-label-s ml-2 shrink-0 whitespace-nowrap transition-opacity',
                                    search.length >= maxLength - 5 ? 'opacity-100' : 'opacity-0',
                                    search.length >= maxLength
                                        ? 'text-sarge-error-700 animate-shake'
                                        : 'text-sarge-gray-300'
                                )}
                            >
                                {search.length}/{maxLength}
                            </span>
                        )}
                    </div>

                    <CommandList className="max-h-64 overflow-y-auto">
                        {showSelectAll && multiple && (
                            <>
                                <CommandGroup>
                                    <CommandItem
                                        value="__select_all__"
                                        onSelect={handleSelectAll}
                                        className="text-label-s text-sarge-gray-800 data-[selected=true]:bg-sarge-gray-50 flex cursor-pointer items-center rounded-lg px-3 py-2"
                                    >
                                        {renderSelectionIcon(allSelected)}
                                        Select All
                                    </CommandItem>
                                </CommandGroup>
                                <div
                                    role="separator"
                                    className="bg-sarge-gray-200 mx-1 my-1 h-px"
                                />
                            </>
                        )}

                        <CommandEmpty>
                            {onCreateOption && search.trim() ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        onCreateOption(search.trim());
                                        setSearch('');
                                    }}
                                    className="text-label-s text-sarge-primary-500 hover:bg-sarge-gray-50 flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2"
                                >
                                    <Plus className="size-4" />
                                    Create &ldquo;{search.trim()}&rdquo;
                                </button>
                            ) : (
                                <span className="text-body-s text-sarge-gray-500 px-3 py-2">
                                    {emptyText}
                                </span>
                            )}
                        </CommandEmpty>

                        <CommandGroup>
                            {options.map((opt) => {
                                const selected = multiple
                                    ? multiValues.includes(opt.value)
                                    : singleValue === opt.value;
                                return (
                                    <CommandItem
                                        key={String(opt.value)}
                                        value={opt.label}
                                        onSelect={() => handleSelect(opt)}
                                        className="text-label-s text-sarge-gray-800 data-[selected=true]:bg-sarge-gray-50 flex h-9 cursor-pointer items-center rounded-lg px-3 py-2"
                                    >
                                        {renderSelectionIcon(selected)}
                                        {opt.label}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export const Combobox = ComboboxInner as <T = string>(
    props: ComboboxProps<T>
) => React.ReactElement;
