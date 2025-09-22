import { UserController } from '@/lib/controllers/user.controller';
import { ValidationError } from '@/lib/schemas/errors';
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
    } catch (error) {
        if (error instanceof ValidationError) {
            return NextResponse.json(
                {
                    success: false,
                    error: error.message,
                },
                { status: 400 }
            );
        }

        const message = error instanceof Error ? error.message : String(error);

        return NextResponse.json(
            {
                success: false,
                error: message,
            },
            { status: 500 }
        );
    }
}
