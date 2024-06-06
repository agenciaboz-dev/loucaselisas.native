import { Prisma } from "@prisma/client";
import { Socket } from "socket.io";
import { Permissions, PermissionsForm } from "./Permissions";
import { WithoutFunctions } from "./helpers";
export declare const role_include: {
    permissions: true;
};
export type RolePrisma = Prisma.RoleGetPayload<{
    include: typeof role_include;
}>;
export type PartialRole = Partial<WithoutFunctions<Role>> & {
    id: string;
};
export type RoleForm = Omit<WithoutFunctions<Role>, "id"> & {
    permissions: PermissionsForm;
};
export declare class Role {
    id: number;
    name: string;
    description: string;
    permissions: Permissions;
    constructor(data: RolePrisma);
    static list(): Promise<Role[]>;
    static existsDefault(): Promise<boolean>;
    static createDefault(socket?: Socket): Promise<void>;
    static create(role: RoleForm): Promise<Role | undefined>;
    load(data: RolePrisma): void;
    update(data: Partial<Role>): Promise<void>;
}
