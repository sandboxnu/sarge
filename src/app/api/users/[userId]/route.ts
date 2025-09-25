import { UserController } from '@/lib/controllers/user.controller';
import { UserNotFoundError } from '@/lib/schemas/user.schema';
import { type NextRequest, NextResponse } from 'next/server';

const userController = new UserController();

interface RouteParams {
    userId: string;
}

export async function DELETE(_request: NextRequest, context: { params: RouteParams }) {
    try {
        const { userId } = context.params;
        const user = await userController.delete(userId);
        return NextResponse.json(
            {
                success: true,
                data: user,
                message: 'User Successfully Deleted',
            },
            { status: 200 }
        );
    } catch (err) {
        if (err instanceof UserNotFoundError) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'User Not Found',
                },
                { status: 404 }
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
