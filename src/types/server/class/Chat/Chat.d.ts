import { Prisma } from "@prisma/client";
import { Gallery } from "../Gallery/Gallery";
import { Socket } from "socket.io";
export declare const chat_include: {
    media: {
        include: {
            media: true;
        };
    };
    _count: {
        select: {
            messages: true;
        };
    };
};
export type ChatPrisma = Prisma.ChatGetPayload<{
    include: typeof chat_include;
}>;
export declare class Chat {
    id: string;
    description: string | null;
    media: Gallery;
    messages: number;
    static join(chat_id: string, socket: Socket): Promise<void>;
    constructor(data: ChatPrisma);
}
