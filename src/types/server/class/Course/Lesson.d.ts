import { Prisma } from "@prisma/client";
import { Media, MediaForm } from "../Gallery/Media";
import { FileUpload, WithoutFunctions } from "../helpers";
export declare const lesson_include: {
    media: true;
    user_downloads: {
        include: {
            _count: true;
        };
    };
};
export type LessonPrisma = Prisma.LessonGetPayload<{
    include: typeof lesson_include;
}>;
export type LessonForm = Omit<WithoutFunctions<Lesson>, "id" | "published" | "thumb" | "user_views" | "user_likes" | "user_downloads" | "active"> & {
    thumb: FileUpload;
    media: MediaForm;
};
export type PartialLesson = Partial<Lesson> & {
    id: string;
};
export declare class Lesson {
    id: string;
    published: string;
    name: string;
    thumb: string | null;
    info: string;
    active: boolean;
    media: Media;
    user_views: number;
    user_likes: number;
    user_downloads: number;
    course_id: string;
    pdf: string | null;
    static new(data: LessonForm): Promise<Lesson>;
    constructor(id: string, data?: LessonPrisma);
    init(): Promise<void>;
    load(data: LessonPrisma): void;
    updateMedia(media: MediaForm, thumb: FileUpload): Promise<void>;
    update(data: Partial<LessonForm>): Promise<void>;
}
