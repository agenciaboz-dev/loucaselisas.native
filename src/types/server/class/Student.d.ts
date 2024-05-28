import { Prisma } from "@prisma/client";
import { Course } from "./Course";
export declare const student_include: {
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
                    course: true;
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
            };
            plans: true;
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
    user: true;
};
export type StudentPrisma = Prisma.StudentGetPayload<{
    include: typeof student_include;
}>;
export declare class Student {
    courses: Course[];
    id: string;
    user_id: string;
    constructor(id: string, data?: StudentPrisma);
    load(data: StudentPrisma): void;
}
