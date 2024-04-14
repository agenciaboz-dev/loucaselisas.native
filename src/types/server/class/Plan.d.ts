import { Prisma } from "@prisma/client";
import { PlanPurchaseForm } from "../types/shared/PlanPurchaseForm";
export type PlanPrisma = Prisma.PlanGetPayload<{}>;
export declare const plan_contract_include: {
    plan_data: true;
};
export type PlanContractPrisma = Prisma.PlanContractGetPayload<{
    include: typeof plan_contract_include;
}>;
export declare const contract_log_include: {
    plan: true;
};
export type ContractLogPrisma = Prisma.ContractLogsGetPayload<{
    include: typeof contract_log_include;
}>;
export declare class PlanContract {
    id: number;
    start_date: string;
    end_date: string;
    paid: number;
    plan_data: Plan;
    constructor(data: PlanContractPrisma);
}
export declare class Plan {
    id: number;
    name: string;
    price: number;
    duration: string;
    description: string;
    static list(): Promise<{
        id: number;
        name: string;
        price: number;
        duration: string;
        description: string;
    }[]>;
    static purchase(data: PlanPurchaseForm): Promise<PlanContract>;
    constructor(id: number, data?: PlanPrisma);
    load(data: PlanPrisma): void;
    init(): Promise<void>;
}
export declare class ContractLog {
    id: number;
    start_date: string;
    end_date: string;
    paid: number;
    plan: Plan;
    static getUserLogs(user_id: string): Promise<ContractLog[]>;
    constructor(data: ContractLogPrisma);
}
