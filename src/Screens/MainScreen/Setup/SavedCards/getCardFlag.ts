const mastercard = require("../../../../../assets/cards/mastercard.png")
const visa = require("../../../../../assets/cards/visa.png")

export const getCardFlag = (flag: string | null) => {
    if (flag == "mastercard") return mastercard
    return visa
}
