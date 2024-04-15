export const unmaskCurrency = (value: string | number) =>
    Number(
        value
            .toString()
            .replace(/[^\d,]/g, "")
            .replace(",", ".")
    )
