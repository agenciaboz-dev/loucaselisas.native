import React from "react"
import Svg, { G, Path } from "react-native-svg"
import { colors } from "../style/colors"
import { Image } from "expo-image"

interface LogoProps {
    size?: number
}

export const Logo: React.FC<LogoProps> = ({ size }) => {
    const default_size = 200
    return <Image source={require("../../assets/logo.webp")} style={{ width: size || default_size, height: size || default_size }} />
}
