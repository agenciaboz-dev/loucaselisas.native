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
    id?: string;
    media: MediaForm[];
};
export declare class Gallery {
    id: string;
    name: string;
    media: Media[];
    constructor(id: string, data?: GalleryPrisma);
    static new(data: GalleryForm): Promise<Gallery>;
    init(): Promise<void>;
    load(data: GalleryPrisma): void;
    updateMedia(list: MediaForm[]): Promise<void>;
}
