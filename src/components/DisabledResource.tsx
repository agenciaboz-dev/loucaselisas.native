import React from "react"
import { View } from "react-native"
import { ScreenTitle } from "./ScreenTItle"
import { Icon, Text } from "react-native-paper"

interface DisabledResourceProps {
    type: "lesson" | "course"
}

export const DisabledResource: React.FC<DisabledResourceProps> = ({ type }) => {
    return (
        <View style={{ flex: 1, padding: 20, gap: 10 }}>
            <ScreenTitle title={`${type == "lesson" ? "Lição" : "Curso"} não encontrad${type == "lesson" ? "a" : "o"}`} />
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#F4F4F4",
                    padding: 20,
                    borderRadius: 15,
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <Icon size={100} source={"alert-outline"} />
                <Text style={{ textAlign: "center" }} variant="headlineSmall">
                    O link que você tentou acessar parece estar quebrado ou não existe.
                </Text>

                <Text style={{ textAlign: "center", color: "#88827C" }} variant="bodyMedium">
                    Por favor, verifique se o endereço está correto ou entre em contato com o suporte técnico para mais ajuda.
                </Text>
            </View>
        </View>
    )
}
