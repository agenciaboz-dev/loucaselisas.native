import React from "react"
import { TextInput as PaperTextInput, TextInputProps } from "react-native-paper"
import { colors } from "../../style/colors"
import { TextInput as OriginalInput } from "react-native"

interface CustomTextInputProps extends TextInputProps {}

export const TextInput = React.forwardRef<React.ElementRef<typeof OriginalInput>, CustomTextInputProps>((props, ref) => {
    return (
        <PaperTextInput
            {...props}
            ref={ref}
            mode="outlined"
            style={{ backgroundColor: colors.primary }}
            outlineStyle={{ borderRadius: 10 }}
            dense
            textColor={colors.secondary}
            cursorColor={colors.secondary}
            selectionColor={colors.secondary}
            activeOutlineColor={colors.secondary}
        />
    )
})
