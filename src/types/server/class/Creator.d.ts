import { Prisma } from "@prisma/client";
import { WithoutFunctions } from "./helpers";
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
export declare class Creator {
    id: string;
    user_id: string;
    nickname: string;
    language: string;
    description: string;
    active: boolean;
    favorited_by: number;
    owned_courses: Course[];
    courses: Course[];
    constructor(id: string, data?: CreatorPrisma);
    init(): Promise<void>;
    static list(socket: Socket): Promise<void>;
    static new(data: CreatorForm, socket?: Socket): Promise<Creator | undefined>;
    static delete(id: string, socket?: Socket): Promise<{
        id: string;
        user_id: string;
        nickname: string;
        language: string;
        description: string;
        active: boolean;
    } | undefined>;
    load(data: CreatorPrisma): void;
    update(data: PartialCreator): Promise<this | undefined>;
}
