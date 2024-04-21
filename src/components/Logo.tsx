import React from "react"
import { Image } from "expo-image"
import { ColorValue } from "react-native"

interface LogoProps {
    size?: number
    tintColor?: ColorValue
}

export const Logo: React.FC<LogoProps> = ({ size = 200, tintColor = "white" }) => {
    return <Image source={require("../../assets/logo.webp")} style={{ width: size, height: size, tintColor: tintColor }} />
}
