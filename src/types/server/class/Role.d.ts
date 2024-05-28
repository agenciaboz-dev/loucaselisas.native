import { Prisma } from "@prisma/client";
import { Socket } from "socket.io";
import { Permissions } from "./Permissions";
export declare const role_include: {
    permissions: true;
};
export type RolePrisma = Prisma.RoleGetPayload<{
    include: typeof role_include;
}>;
export declare class Role {
    id: number;
    name: string;
    permissions: Permissions;
    constructor(data: RolePrisma);
    static list(): Promise<Role[]>;
    static existsDefault(): Promise<boolean>;
    static createDefault(socket?: Socket): Promise<void>;
    static new(role: Partial<Role>): Promise<void>;
    load(data: RolePrisma): void;
    update(data: Partial<Role>): Promise<void>;
}
