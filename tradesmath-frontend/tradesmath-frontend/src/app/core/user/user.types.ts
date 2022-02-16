export interface User {
    id: string;
    key: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    status?: string;
    password: string | undefined;
    isAdmin: boolean | false;
    isSuperAdmin: boolean | false;
    isActive: boolean | false;
    invitedBy: string | undefined;
    profileImage: string | undefined;
}
