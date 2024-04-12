import { Prisma } from "@prisma/client";
import { AdminPermissions, GeneralPermissions, ProfilePermissions } from "./Permissions";
import { Socket } from "socket.io";
export declare const role_include: {
    admin_permissions: true;
    general_permissions: true;
    profile_permissions: true;
};
export type RolePrisma = Prisma.RoleGetPayload<{
    include: typeof role_include;
}>;
export declare class Role {
    id: number;
    name: string;
    profile_permissions: ProfilePermissions;
    admin_permissions: AdminPermissions;
    general_permissions: GeneralPermissions;
    constructor(data: RolePrisma);
    static existsDefault(): Promise<boolean>;
    static createDefault(socket: Socket): Promise<void>;
    load(data: RolePrisma): void;
    update(data: Partial<Role>): Promise<void>;
}
