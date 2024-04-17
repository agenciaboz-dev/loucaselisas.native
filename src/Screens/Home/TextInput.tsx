import React from "react"
import { TextInput as PaperTextInput, Text, TextInputProps } from "react-native-paper"
import { colors } from "../../style/colors"
import { TextInput as OriginalInput, View } from "react-native"

interface CustomTextInputProps extends TextInputProps {}

export const TextInput = React.forwardRef<React.ElementRef<typeof OriginalInput>, CustomTextInputProps>((props, ref) => {
    return (
        <View style={{ gap: 5 }}>
            <Text style={{ color: colors.secondary }}>{props.label}</Text>
            <PaperTextInput
                {...props}
                ref={ref}
                mode="outlined"
                label={undefined}
                style={{ backgroundColor: "transparent" }}
                outlineStyle={{ borderRadius: 10 }}
                dense
                textColor={colors.secondary}
                cursorColor={colors.secondary}
                selectionColor={colors.secondary}
                activeOutlineColor={colors.secondary}
            />
        </View>
    )
})
