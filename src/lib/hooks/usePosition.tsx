/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { type PositionDTO } from '@/lib/schemas/position.schema';
import { type PositionWithCounts } from '@/lib/types/position.types';

export default function usePosition() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [positions, setPositions] = useState<PositionWithCounts[]>([]);
    const [filter, setFilter] = useState<string>(''); // This ticket will implement this feature https://github.com/sandboxnu/sarge/issues/122
    const [sort, setSort] = useState<string>('createdAt');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        async function fetchPositions() {
            try {
                const response = await fetch('/api/position');
                if (!response.ok) {
                    setError('Failed to fetch positions');
                    return;
                }
                const data = await response.json();
                const positions = data.data as PositionWithCounts[];
                setPositions(positions);
            } catch (err) {
                setError('An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        }

        setLoading(true);
        fetchPositions();
    }, []);

    async function createPosition(title: string) {
        try {
            const response = await fetch('/api/position', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title }),
            });
            if (!response.ok) {
                throw new Error('Failed to create position');
            }
            const result = await response.json();
            setPositions((prev) => [...prev, result.data]);
        } catch (err) {
            setError('An unexpected error occurred');
        }
    }

    // The frontend flow to sort positions does not exist yet a ticket has been created to add it.
    // https://github.com/sandboxnu/sarge/issues/122
    async function sortPositions() {
        setPositions((prevPositions) => {
            return [...prevPositions].sort((a, b) => {
                if (sort === 'createdAt') {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                }
                if (sort === 'title') {
                    return a.title.localeCompare(b.title);
                }
                return 0;
            });
        });
    }

    const archived: PositionWithCounts[] = [];

    return {
        positions,
        loading,
        error,
        archived,
        createPosition,
        sortPositions,
        isModalOpen,
        setIsModalOpen,
    };
}
