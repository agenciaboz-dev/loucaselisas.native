import { Prisma } from "@prisma/client";
import { Socket } from "socket.io";
import { LoginForm } from "../types/shared/login";
import { Course } from "./Course";
import { PaymentCard, PaymentCardForm } from "./PaymentCard";
import { FileUpload, WithoutFunctions } from "./helpers";
import { Creator, CreatorForm, Student } from "./index";
import { Role } from "./Role";
export declare const user_include: {
    creator: {
        include: {
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
    };
    favorite_courses: true;
    favorite_creators: {
        include: {
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
    };
    payment_cards: true;
    role: {
        include: {
            admin_permissions: true;
            general_permissions: true;
            profile_permissions: true;
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
export type UserForm = Omit<WithoutFunctions<User>, "id" | "admin" | "favorite_creators" | "favorite_courses" | "payment_cards" | "creator" | "student" | "role" | "cover" | "image" | "payment_cards"> & {
    image: FileUpload | null;
    cover: FileUpload | null;
    student: boolean;
    creator: CreatorForm | null;
    payment_cards: PaymentCardForm[];
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
    favorite_creators: Creator[];
    favorite_courses: Course[];
    payment_cards: PaymentCard[];
    creator: Creator | null;
    student: Student | null;
    role: Role;
    constructor(id: string, user_prisma?: UserPrisma);
    init(): Promise<void>;
    static update(data: Partial<UserPrisma> & {
        id: string;
    }, socket: Socket): Promise<void>;
    static updateImage(data: UserImageForm & {
        id: string;
    }, socket: Socket): Promise<void>;
    static signup(socket: Socket, data: UserForm): Promise<void>;
    static list(socket: Socket): Promise<void>;
    static login(data: LoginForm, socket?: Socket): Promise<User | null>;
    load(data: UserPrisma): void;
    update(data: Partial<UserPrisma>, socket?: Socket): Promise<void>;
    updateImage(data: UserImageForm, socket?: Socket): Promise<void>;
}
