import { Prisma } from "@prisma/client";
import { FileUpload, WithoutFunctions } from "./helpers";
import { Course } from "./Course";
export declare const category_include: {};
export type CategoryPrisma = Prisma.CategoryGetPayload<{
    include: typeof category_include;
}>;
export type CategoryForm = Omit<WithoutFunctions<Category>, "id" | "cover"> & {
    cover?: FileUpload;
};
export declare class Category {
    id: string;
    name: string;
    cover: string;
    static list(): Promise<Category[]>;
    static new(data: CategoryForm): Promise<Category>;
    constructor(id: string, data?: CategoryPrisma);
    init(): Promise<void>;
    load(data: CategoryPrisma): void;
    updateCover(cover: FileUpload): Promise<void>;
    getCourses(): Promise<Course[]>;
}
