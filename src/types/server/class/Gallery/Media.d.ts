import { Prisma } from "@prisma/client";
import { FileUpload } from "../helpers";
export type MediaPrisma = Prisma.MediaGetPayload<{}>;
export type MediaForm = FileUpload & {
    type: "IMAGE" | "VIDEO";
    id?: string;
    url?: string;
};
export declare class Media {
    id: string;
    url: string;
    type: "IMAGE" | "VIDEO";
    constructor(data: MediaPrisma);
}
