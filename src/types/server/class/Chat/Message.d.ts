import { Prisma } from "@prisma/client";
import { Socket } from "socket.io";
import { FilterPrimitive, WithoutFunctions } from "../helpers";
import { User } from "../User";
import { Media, MediaForm } from "../Gallery/Media";
export declare const message_include: {
    user: true;
    media: true;
};
export type MessagePrisma = Prisma.MessageGetPayload<{
    include: typeof message_include;
}>;
export type MessageForm = Omit<WithoutFunctions<Message>, "id" | "user" | "datetime" | "media_id" | "media"> & {
    media?: MediaForm;
};
export declare class Message {
    id: string;
    text: string;
    datetime: string;
    user_id: string | null;
    user: FilterPrimitive<User> | null;
    chat_id: string;
    video_id: string | null;
    video_timestamp: string | null;
    media_id: string | null;
    media: Media | null;
    static new(data: MessageForm, socket: Socket): Promise<void>;
    constructor(data: MessagePrisma);
}
