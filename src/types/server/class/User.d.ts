import { Prisma } from "@prisma/client";
import { Socket } from "socket.io";
import { LoginForm } from "../types/shared/login";
import { PaymentCard, PaymentCardForm } from "./PaymentCard";
import { FileUpload, WithoutFunctions } from "./helpers";
import { Creator, CreatorForm, Student } from "./index";
import { Role } from "./Role";
import { PlanContract } from "./Plan";
export declare const user_include: {
    creator: {
        include: {
            categories: true;
            favorited_by: true;
        };
    };
    student: {
        include: {
            user: true;
            courses: {
                include: {
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
                            admin_permissions: true;
                            general_permissions: true;
                            profile_permissions: true;
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
            };
        };
    };
    favorite_courses: {
        select: {
            id: true;
        };
    };
    favorite_creators: true;
    payment_cards: true;
    role: {
        include: {
            admin_permissions: true;
            general_permissions: true;
            profile_permissions: true;
        };
    };
    plan: {
        include: {
            plan_data: true;
        };
    };
};
export type UserPrisma = Prisma.UserGetPayload<{
    include: typeof user_include;
}>;
export interface UserImageForm {
    id: string;
    image?: FileUpload | null;
    cover?: FileUpload | null;
}
export type UserForm = Omit<WithoutFunctions<User>, "id" | "plan" | "plan_history" | "admin" | "favorite_creators" | "favorite_courses" | "payment_cards" | "creator" | "student" | "role" | "cover" | "image" | "payment_cards"> & {
    image: FileUpload | null;
    cover: FileUpload | null;
    student: boolean;
    creator: CreatorForm | null;
    payment_cards: PaymentCardForm[];
};
export type PartialUser = Partial<User> & {
    id: string;
};
export declare class User {
    id: string;
    username: string;
    email: string;
    password: string;
    name: string;
    cpf: string;
    birth: string;
    phone: string;
    pronoun: string;
    uf: string;
    admin: boolean;
    instagram: string | null;
    tiktok: string | null;
    profession: string | null;
    image: string | null;
    cover: string | null;
    bio: string | null;
    google_id: string | null;
    google_token: string | null;
    favorite_creators: string[];
    favorite_courses: {
        id: string;
    }[];
    payment_cards: PaymentCard[];
    creator: Creator | null;
    student: Student | null;
    plan: PlanContract | null;
    role: Role;
    constructor(id: string, user_prisma?: UserPrisma);
    init(): Promise<void>;
    static update(data: PartialUser, socket: Socket): Promise<void>;
    static updateImage(data: UserImageForm & {
        id: string;
    }, socket: Socket): Promise<void>;
    static signup(data: UserForm, socket?: Socket): Promise<string | User | undefined>;
    static list(socket: Socket): Promise<void>;
    static login(data: LoginForm & {
        admin?: boolean;
    }, socket?: Socket): Promise<User | null>;
    load(data: UserPrisma): void;
    update(data: Partial<User>, socket?: Socket): Promise<string | undefined>;
    updateImage(data: UserImageForm, socket?: Socket): Promise<void>;
}
