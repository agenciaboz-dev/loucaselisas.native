import { Prisma } from "@prisma/client";
import { Media } from "../Gallery/Media";
import { FileUpload, WithoutFunctions } from "../helpers";
export declare const lesson_include: {
    image: true;
    video: true;
};
export type LessonPrisma = Prisma.LessonGetPayload<{
    include: typeof lesson_include;
}>;
export type LessonForm = Omit<WithoutFunctions<Lesson>, "id" | "published" | "cover" | "image" | "video"> & {
    cover?: FileUpload;
    image?: FileUpload;
    video?: FileUpload;
};
export declare class Lesson {
    id: string;
    published: string;
    name: string;
    cover: string | null;
    info: string;
    image: Media | null;
    pdf: string | null;
    video: Media | null;
    constructor(data: LessonPrisma);
}
