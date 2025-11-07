type AuthenticatedUser = {
    id: string;
    name: string | null;
    email: string | null;
    orgId: string | null;
    orgName: string | null;
};

type UnauthenticatedUser = {
    id: null;
    name: null;
    email: null;
    orgId: null;
    orgName: null;
};

export type User = AuthenticatedUser | UnauthenticatedUser;
