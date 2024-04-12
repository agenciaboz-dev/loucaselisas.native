import { Prisma } from "@prisma/client";
import { WithoutFunctions } from "./helpers";
export type PaymentCardPrisma = Prisma.PaymentcardGetPayload<{}>;
export type PaymentCardForm = WithoutFunctions<PaymentCard>;
export declare class PaymentCard {
    id: string;
    number: string;
    owner: string;
    validity: string;
    cvc: string;
    type: string;
    constructor(data: PaymentCardPrisma);
}
