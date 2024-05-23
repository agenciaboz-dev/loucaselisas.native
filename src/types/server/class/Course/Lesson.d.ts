import { Prisma } from "@prisma/client";
import { Media, MediaForm } from "../Gallery/Media";
import { FileUpload, WithoutFunctions } from "../helpers";
import { Status } from "../Course";
export declare const lesson_include: {
    media: true;
    likes: true;
    course: true;
    _count: {
        select: {
            downloads: true;
            likes: true;
            views: true;
        };
    };
};
export type LessonPrisma = Prisma.LessonGetPayload<{
    include: typeof lesson_include;
}>;
export type LessonForm = Omit<WithoutFunctions<Lesson>, "id" | "published" | "thumb" | "views" | "likes" | "downloads" | "active" | "course" | "favorited_by" | "media" | "declined_reason" | "status"> & {
    thumb?: FileUpload;
    media?: MediaForm;
    declined_reason?: string;
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
    media: Media;
    views: number;
    likes: number;
    downloads: number;
    course_id: string;
    course: any;
    favorited_by: {
        id: string;
    }[];
    pdf: string | null;
    status: Status;
    declined_reason: string | null;
    static new(data: LessonForm): Promise<Lesson>;
    static list(): Promise<Lesson[]>;
    constructor(id: string, data?: LessonPrisma);
    init(): Promise<void>;
    load(data: LessonPrisma): void;
    updateMedia(media: MediaForm): Promise<void>;
    updateThumb(thumb: FileUpload): Promise<void>;
    update(data: Partial<LessonForm>): Promise<void>;
    addLike(user_id: string, like?: boolean): Promise<void>;
    addView(user_id: string): Promise<void>;
    getViews(): Promise<{
        id: number;
        datetime: string;
        lesson_id: string;
        user_id: string;
    }[] | undefined>;
}
