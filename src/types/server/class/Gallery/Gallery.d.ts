import { Prisma } from "@prisma/client";
import { WithoutFunctions } from "../helpers";
import { Media, MediaForm } from "./Media";
export declare const gallery_include: {
    media: true;
};
export type GalleryPrisma = Prisma.GalleryGetPayload<{
    include: typeof gallery_include;
}>;
export type GalleryForm = Omit<WithoutFunctions<Gallery>, "id" | "media"> & {
    media: MediaForm[];
};
export declare class Gallery {
    id: string;
    name: string;
    media: Media[];
    constructor(data: GalleryPrisma);
    static new(data: GalleryForm): Promise<Gallery>;
    load(data: GalleryPrisma): void;
    updateMedia(list: MediaForm[]): Promise<void>;
}
