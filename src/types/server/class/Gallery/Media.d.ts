import { Prisma } from "@prisma/client";
export type MediaPrisma = Prisma.MediaGetPayload<{}>;
export declare class Media {
    id: string;
    url: string;
    constructor(data: MediaPrisma);
}
