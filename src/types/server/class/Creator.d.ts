import { Prisma } from "@prisma/client";
import { FileUpload, WithoutFunctions } from "./helpers";
import { Course } from "./Course";
import { Socket } from "socket.io";
export declare const creator_include: {
    categories: true;
    courses: {
        include: {
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
    };
    favorited_by: true;
    owned_courses: {
        include: {
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
    };
};
export type CreatorPrisma = Prisma.CreatorGetPayload<{
    include: typeof creator_include;
}>;
export type CreatorType = WithoutFunctions<Creator>;
export type CreatorForm = Omit<WithoutFunctions<Creator>, "active" | "courses" | "id">;
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
    owned_courses: Course[];
    cover: string | null;
    image: string | null;
    courses: Course[];
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
    } | undefined>;
    load(data: CreatorPrisma): void;
    update(data: Partial<Creator>): Promise<this | undefined>;
    updateImage(data: CreatorImageForm, socket?: Socket): Promise<void>;
}
