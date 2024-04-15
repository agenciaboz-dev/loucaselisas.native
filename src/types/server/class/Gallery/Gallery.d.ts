import { Prisma } from "@prisma/client";
import { FileUpload, WithoutFunctions } from "../helpers";
import { Media } from "./Media";
export declare const gallery_include: {
    media: true;
};
export type GalleryPrisma = Prisma.GalleryGetPayload<{
    include: typeof gallery_include;
}>;
export type GalleryForm = Omit<WithoutFunctions<Gallery>, "id" | "media"> & {
    media: FileUpload[];
};
export declare class Gallery {
    id: string;
    name: string;
    media: Media[];
    constructor(data: GalleryPrisma);
    static new(data: GalleryForm): Promise<Gallery>;
}
