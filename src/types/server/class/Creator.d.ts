import { Prisma } from "@prisma/client";
import { FileUpload, WithoutFunctions } from "./helpers";
import { Course } from "./Course";
import { Socket } from "socket.io";
import { Lesson } from "./Course/Lesson";
export declare const creator_include: {
    categories: true;
    favorited_by: true;
};
export type CreatorPrisma = Prisma.CreatorGetPayload<{
    include: typeof creator_include;
}>;
export type CreatorType = WithoutFunctions<Creator>;
export type CreatorForm = Omit<WithoutFunctions<Creator>, "active" | "courses" | "id" | "favorited_by" | "need_send_data">;
export type PartialCreator = Partial<Creator> & {
    id: string;
};
export interface CreatorImageForm {
    id: string;
    image?: FileUpload | null;
    cover?: FileUpload | null;
}
export declare class Creator {
    id: string;
    user_id: string;
    nickname: string;
    language: string;
    description: string;
    active: boolean;
    favorited_by: number;
    cover: string | null;
    image: string | null;
    need_send_data: boolean;
    constructor(id: string, data?: CreatorPrisma);
    init(): Promise<void>;
    static list(socket?: Socket): Promise<Creator[]>;
    static new(data: CreatorForm, socket?: Socket): Promise<Creator | undefined>;
    static delete(id: string, socket?: Socket): Promise<{
        id: string;
        user_id: string;
        nickname: string;
        language: string;
        description: string;
        active: boolean;
        image: string | null;
        cover: string | null;
        created_at: string;
        need_send_data: boolean;
    } | undefined>;
    load(data: CreatorPrisma): void;
    update(data: Partial<Creator>): Promise<this | undefined>;
    updateImage(data: CreatorImageForm, socket?: Socket): Promise<void>;
    getCourses(): Promise<Course[]>;
    getLessons(course_list?: Course[]): Promise<Lesson[]>;
    getStatistics(): Promise<{
        views: number;
        likes: number;
        downloads: number;
        messages: number;
    }>;
}
