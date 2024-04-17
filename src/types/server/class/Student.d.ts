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
                    media: true;
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
                    _count: true;
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
