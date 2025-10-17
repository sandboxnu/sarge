import { getCurrentUser } from '@/lib/auth/auth-service';

export default async function DashboardPage() {
    const name = await getCurrentUser();

    return <div className="">{name?.name}</div>;
}
