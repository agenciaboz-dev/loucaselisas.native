import { Prisma } from "@prisma/client";
import { Gallery } from "../Gallery/Gallery";
import { Message } from "./Message";
export declare const chat_include: {
    media: {
        include: {
            images: true;
            videos: true;
        };
    };
    messages: true;
};
export type ChatPrisma = Prisma.ChatGetPayload<{
    include: typeof chat_include;
}>;
export declare class Chat {
    id: string;
    description: string | null;
    media: Gallery;
    messages: Message[];
    constructor(data: ChatPrisma);
}
