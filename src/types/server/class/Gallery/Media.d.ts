import { Prisma } from "@prisma/client";
export type MediaPrisma = Prisma.ImageGetPayload<{}>;
export declare class Media {
    id: string;
    url: string;
    constructor(data: MediaPrisma);
}
