import { Prisma } from "@prisma/client";
import { FileUpload, WithoutFunctions } from "../helpers";
export type MediaPrisma = Prisma.MediaGetPayload<{}>;
export type MediaForm = FileUpload & Omit<WithoutFunctions<Partial<Media>>, "position" | "height" | "width"> & {
    position: number;
    width: number;
    height: number;
};
export declare class Media {
    id: string;
    url: string;
    type: "IMAGE" | "VIDEO";
    position: number;
    width: number;
    height: number;
    constructor(data: MediaPrisma);
}
