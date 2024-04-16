import { Prisma } from "@prisma/client";
import { WithoutFunctions } from "./helpers";
export type PaymentCardPrisma = Prisma.PaymentcardGetPayload<{}>;
export type PaymentCardForm = WithoutFunctions<PaymentCard> & {
    user_id: string;
};
export declare class PaymentCard {
    id: number;
    number: string;
    owner: string;
    validity: string;
    cvc: string;
    type: "CREDIT" | "DEBIT";
    bank: string | null;
    flag: string | null;
    static getUserCards(user_id: string): Promise<PaymentCard[]>;
    constructor(data: PaymentCardPrisma);
}
