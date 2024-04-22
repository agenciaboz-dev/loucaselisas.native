import { Prisma } from "@prisma/client";
import { Socket } from "socket.io";
import { WithoutFunctions } from "../helpers";
export declare const message_include: {
    user: true;
};
export type MessagePrisma = Prisma.MessageGetPayload<{
    include: {
        user: true;
    };
}>;
export type MessageForm = Omit<WithoutFunctions<Message>, "id" | "user" | "datetime">;
export declare class Message {
    id: string;
    text: string;
    datetime: string;
    user_id: string | null;
    user: any | null;
    chat_id: string;
    video_id: string | null;
    video_timestamp: string | null;
    static new(data: MessageForm, socket: Socket): Promise<void>;
    constructor(data: MessagePrisma);
}
