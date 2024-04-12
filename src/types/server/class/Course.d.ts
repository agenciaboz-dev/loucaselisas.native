import { Creator } from "./Creator";
import { Category } from "./Category";
import { Prisma } from "@prisma/client";
import { Gallery, GalleryForm } from "./Gallery/Gallery";
import { Chat } from "./Chat/Chat";
import { Lesson, LessonForm } from "./Course/Lesson";
import { FileUpload, WithoutFunctions } from "./helpers";
import { Socket } from "socket.io";
export declare const course_include: {
    categories: true;
    chat: {
        include: {
            media: {
                include: {
                    images: true;
                    videos: true;
                };
            };
            messages: true;
        };
    };
    creators: {
        include: {
            user: true;
        };
    };
    gallery: {
        include: {
            images: true;
            videos: true;
        };
    };
    owner: {
        include: {
            user: true;
        };
    };
    students: true;
    favorited_by: true;
    lessons: {
        include: {
            image: true;
            video: true;
        };
    };
};
export type CoursePrisma = Prisma.CourseGetPayload<{
    include: typeof course_include;
}>;
export type CourseForm = Omit<WithoutFunctions<Course>, "id" | "favorited_by" | "lessons" | "cover" | "owner" | "gallery" | "categories" | "creators" | "chat"> & {
    lessons: LessonForm[];
    cover?: FileUpload;
    gallery: GalleryForm;
    categories: {
        id: string;
    }[];
    creators: {
        id: string;
    }[];
    owner_id: string;
};
export declare class Course {
    id: string;
    name: string;
    cover: string;
    published: string;
    description: string;
    language: string;
    recorder: string | null;
    favorited_by: number;
    lessons: Lesson[];
    owner: Partial<Creator>;
    gallery: Gallery;
    categories: Category[];
    creators: Partial<Creator>[];
    chat: Chat | null;
    constructor(data: CoursePrisma);
    static new(socket: Socket, data: CourseForm): Promise<void>;
}
