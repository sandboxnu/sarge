import { OrganizationController } from '@/lib/controllers/organization.controller';
import { ValidationError } from '@/lib/schemas/organization.schema';
import { type NextRequest, NextResponse } from 'next/server';

const organizationController = new OrganizationController();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const org = await organizationController.create(body);
        return NextResponse.json(
            {
                success: true,
                data: org,
            },
            { status: 200 }
        );
    } catch (err) {
        if (err instanceof ValidationError) {
            return NextResponse.json(
                {
                    success: false,
                    err: err.message,
                },
                { status: 400 }
            );
        }

        const message = err instanceof Error ? err.message : String(err);

        return NextResponse.json(
            {
                success: false,
                error: message,
            },
            { status: 500 }
        );
    }
}
