import React from "react"
import { Button, ButtonProps } from "react-native-paper"

interface FilterButtonProps extends ButtonProps {
    active?: boolean
}

export const FilterButton: React.FC<FilterButtonProps> = (props) => {
    return <Button mode={props.active ? "contained" : "outlined"} {...props} style={{ height: "100%" }} />
}
