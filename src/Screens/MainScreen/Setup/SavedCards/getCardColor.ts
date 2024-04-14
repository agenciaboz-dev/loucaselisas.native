import { BankData } from "../../../../types/BankData"

const banks: BankData[] = [
    { fullname: "Nu Pagamentos Sa", color: "rgb(130, 10, 209)", name: "Nubank" },
    { fullname: "Banco Inter S.A.", name: "Inter", color: "rgb(255, 122, 0)" },
]

export const getBankData = (bank: string | null) => {
    const match = banks.find((item) => item.fullname == bank)

    return match
}
