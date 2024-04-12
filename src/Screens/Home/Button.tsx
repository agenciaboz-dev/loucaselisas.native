import React from "react"
import { ButtonProps, Button as PaperButton } from "react-native-paper"
import { colors } from "../../style/colors"

interface CustomButtonProps extends ButtonProps {}

export const Button: React.FC<CustomButtonProps> = (props) => {
    return <PaperButton {...props} textColor={colors.secondary} compact mode="outlined" />
}
