import { Creator } from "./Creator";
import { Category } from "./Category";
import { Prisma } from "@prisma/client";
import { Gallery, GalleryForm } from "./Gallery/Gallery";
import { Chat } from "./Chat/Chat";
import { Lesson, LessonForm } from "./Course/Lesson";
import { FileUpload, WithoutFunctions } from "./helpers";
import { Socket } from "socket.io";
import { Role } from "./Role";
import { Message } from "./Chat/Message";
import { User } from "./User";
export type Status = "active" | "pending" | "disabled" | "declined";
export interface StatusForm {
    id: string;
    status: Status;
    declined_reason?: string;
    price?: number;
}
export declare const course_include: {
    categories: true;
    chat: {
        include: {
            media: {
                include: {
                    media: true;
                };
            };
            _count: {
                select: {
                    messages: true;
                };
            };
        };
    };
    creators: {
        include: {
            user: true;
        };
    };
    gallery: {
        include: {
            media: true;
        };
    };
    owner: {
        include: {
            user: true;
        };
    };
    favorited_by: {
        select: {
            id: true;
        };
    };
    roles: {
        include: {
            permissions: true;
        };
    };
    lessons: {
        include: {
            _count: {
                select: {
                    downloads: true;
                };
            };
        };
    };
    _count: {
        select: {
            lessons: true;
            favorited_by: true;
            students: true;
            views: true;
        };
    };
};
export type CoursePrisma = Prisma.CourseGetPayload<{
    include: typeof course_include;
}>;
export type CoverForm = {
    file: FileUpload;
    type: "image" | "video";
    url?: string;
};
export type PartialCourse = Partial<Omit<WithoutFunctions<Course>, "favorited_by" | "cover" | "cover_type" | "owner" | "gallery" | "creators" | "chat" | "published" | "lessons" | "students" | "views">> & {
    id: string;
    cover?: CoverForm;
    gallery: GalleryForm;
    creators: {
        id: string;
    }[];
};
export type CourseForm = Omit<WithoutFunctions<Course>, "id" | "favorited_by" | "lessons" | "cover" | "cover_type" | "owner" | "gallery" | "categories" | "creators" | "chat" | "published" | "students" | "views" | "roles" | "likes" | "downloads" | "status" | "declined_reason"> & {
    lessons: LessonForm[];
    cover?: CoverForm;
    gallery: GalleryForm;
    categories: {
        id: string;
    }[];
    creators: {
        id: string;
    }[];
    owner_id: string;
    id?: string;
    declined_reason?: string;
};
export declare class Course {
    id: string;
    name: string;
    cover: string;
    cover_type: "image" | "video";
    published: string;
    description: string;
    language: string;
    recorder: string | null;
    price: number;
    owner: Partial<Creator> & {
        user: Partial<User>;
    };
    owner_id: string;
    gallery: Gallery;
    categories: Category[];
    creators: Partial<Creator>[];
    chat: Chat | null;
    roles: Role[];
    favorited_by: {
        id: string;
    }[];
    status: Status;
    declined_reason: string | null;
    likes: number;
    lessons: number;
    students: number;
    views: number;
    downloads: number;
    constructor(id: string, data?: CoursePrisma);
    static search(text: string): Promise<Course[]>;
    static new(data: CourseForm, socket?: Socket): Promise<Course | undefined>;
    init(): Promise<void>;
    load(data: CoursePrisma): void;
    updateCover(cover: CoverForm): Promise<void>;
    update(data: PartialCourse): Promise<void>;
    viewer(user_id: string): Promise<void>;
    favorite(user_id: string, like?: boolean): Promise<void>;
    getLessons(): Promise<Lesson[]>;
    getLastMessage(): Promise<Message | undefined>;
}
