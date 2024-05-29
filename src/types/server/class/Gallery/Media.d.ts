import { Prisma } from "@prisma/client";
import { FileUpload, WithoutFunctions } from "../helpers";
export type MediaPrisma = Prisma.MediaGetPayload<{}>;
export type MediaForm = FileUpload & Omit<WithoutFunctions<Partial<Media>>, "position" | "height" | "width" | "type" | "duration"> & {
    position: number;
    width: number;
    height: number;
    type: "image" | "video";
    duration?: number;
};
export declare class Media {
    id: string;
    url: string;
    duration: number;
    type: "image" | "video";
    position: number;
    width: number;
    height: number;
    static new(data: MediaForm, pathdir: string): Promise<Media>;
    static update(id: string, data: MediaForm, pathdir: string): Promise<Media>;
    constructor(data: MediaPrisma);
}
