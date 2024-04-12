import { Prisma } from "@prisma/client";
export type MessagePrisma = Prisma.MessageGetPayload<{}>;
export declare class Message {
    id: string;
    text: string;
    datetime: string;
    user_id: string;
    video_id: string | null;
    video_timestamp: string | null;
    constructor(data: MessagePrisma);
}
