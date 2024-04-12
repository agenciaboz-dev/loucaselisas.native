import { Prisma } from "@prisma/client";
import { FileUpload, WithoutFunctions } from "../helpers";
import { Media } from "./Media";
export declare const gallery_include: {
    images: true;
    videos: true;
};
export type GalleryPrisma = Prisma.GalleryGetPayload<{
    include: typeof gallery_include;
}>;
export type GalleryForm = Omit<WithoutFunctions<Gallery>, "id" | "images" | "videos"> & {
    images: FileUpload[];
    videos: FileUpload[];
};
export declare class Gallery {
    id: string;
    name: string;
    images: Media[];
    videos: Media[];
    constructor(data: GalleryPrisma);
    static new(data: GalleryForm): Promise<Gallery>;
}
