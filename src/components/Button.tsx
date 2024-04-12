import React from "react"
import { ButtonProps, Button as PaperButton } from "react-native-paper"

interface CustomButtonProps extends ButtonProps {}

export const Button: React.FC<CustomButtonProps> = (props) => {
    return <PaperButton {...props} />
}
