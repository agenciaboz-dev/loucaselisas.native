import { Prisma } from "@prisma/client";
import { WithoutFunctions } from "./helpers";
export type NotificationPrisma = Prisma.NotificationGetPayload<{}>;
export type NotificationForm = Omit<WithoutFunctions<Notification>, "id" | "viewed" | "datetime" | "status" | "expoPushToken"> & {
    expoPushToken?: string | null;
};
export declare class Notification {
    id: string;
    status: string;
    viewed: boolean;
    body: string;
    datetime: string;
    target_route: string;
    target_param: any;
    user_id: string;
    expoPushToken: string;
    static new(forms: NotificationForm[]): Promise<(import("expo-server-sdk").ExpoPushTicket[] | undefined)[]>;
    constructor(data: NotificationPrisma);
}
