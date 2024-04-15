import { Prisma } from "@prisma/client";
export declare const category_include: {};
export type CategoryPrisma = Prisma.CategoryGetPayload<{
    include: typeof category_include;
}>;
export declare class Category {
    id: string;
    name: string;
    cover: string;
    static list(): Promise<Category[]>;
    constructor(data: CategoryPrisma);
    load(data: CategoryPrisma): void;
}
