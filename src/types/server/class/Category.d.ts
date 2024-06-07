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
export type PartialCategory = Partial<CategoryForm> & {
    id: string;
};
export declare class Category {
    id: string;
    name: string;
    cover: string;
    active: boolean;
    static list(all?: boolean): Promise<Category[]>;
    static new(data: CategoryForm): Promise<Category>;
    constructor(id: string, data?: CategoryPrisma);
    init(): Promise<void>;
    load(data: CategoryPrisma): void;
    updateCover(cover: FileUpload): Promise<void>;
    getCourses(role_id?: number): Promise<Course[]>;
    update(data: PartialCategory): Promise<void>;
}
