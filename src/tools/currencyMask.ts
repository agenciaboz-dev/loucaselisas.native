import { numericFormatter } from "react-number-format"

export const currencyMask = (value: number | string) => {
    return numericFormatter(value.toString(), { decimalSeparator: ",", thousandSeparator: ".", prefix: "R$ " })
}
