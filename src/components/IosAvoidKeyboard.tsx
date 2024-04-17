import React from "react"
import { KeyboardAvoidingView, Platform, View, ViewProps } from "react-native"

export const IosAvoidKeyboard: React.FC<ViewProps> = (props) => {
    return Platform.OS == "ios" ? (
        <KeyboardAvoidingView behavior="position" {...props} style={undefined} contentContainerStyle={props.style} />
    ) : (
        <View {...props} />
    )
}
