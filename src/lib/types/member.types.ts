export type Member = {
    id: string;
    organizationId: string;
    userId: string;
    role: string;
    createdAt: Date;
};

export type MemberWithUser = Member & {
    user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
    };
};
