import { UserController } from '@/lib/controllers/user.controller';
import { ValidationError } from '@/lib/schemas/user.schema';
import { type NextRequest, NextResponse } from 'next/server';

const userController = new UserController();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const user = await userController.create(body);
        return NextResponse.json(
            {
                success: true,
                data: user,
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
