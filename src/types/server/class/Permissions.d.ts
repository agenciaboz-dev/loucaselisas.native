import { Prisma } from "@prisma/client";
export type ProfilePermissionsPrisma = Prisma.ProfilePermissionsGetPayload<{}>;
export type AdminPermissionsPrisma = Prisma.AdminPermissionsGetPayload<{}>;
export type GeneralPermissionsPrisma = Prisma.GeneralPermissionsGetPayload<{}>;
export declare class Permissions {
    id: string;
    constructor({ id }: {
        id: string;
    });
}
export declare class ProfilePermissions extends Permissions {
    viewMembers: boolean;
    privacyProfile: boolean;
    viewPrivacyProfile: boolean;
    indexProfile: boolean;
    constructor(data: ProfilePermissionsPrisma);
}
export declare class AdminPermissions extends Permissions {
    panelAdm: boolean;
    panelCreator: boolean;
    createChats: boolean;
    deleteComments: boolean;
    panelStatistics: boolean;
    updateUsers: boolean;
    deleteUsers: boolean;
    constructor(data: AdminPermissionsPrisma);
}
export declare class GeneralPermissions extends Permissions {
    editProfile: boolean;
    deleteProfile: boolean;
    constructor(data: GeneralPermissionsPrisma);
}
