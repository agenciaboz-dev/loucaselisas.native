import { Prisma } from "@prisma/client";
export type PermissionsPrimsa = Prisma.PermissionsGetPayload<{}>;
export declare class Permissions {
    id: number;
    role_id: number | null;
    panelTab: boolean;
    creatorTab: boolean;
    searchTab: boolean;
    favoritesTab: boolean;
    configTab: boolean;
    static createDefault(): Promise<Permissions>;
    constructor(data: PermissionsPrimsa);
}
