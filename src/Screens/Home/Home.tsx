import { NavigationProp } from "@react-navigation/native"
import React, { useState } from "react"
import { Surface, Text } from "react-native-paper"
import { colors } from "../../style/colors"
import { Logo } from "../../components/Logo"
import { Button } from "./Button"
import { Pressable } from "react-native"
import { Login } from "./Login"

interface HomeProps {
    navigation: NavigationProp<any, any>
}

export const Home: React.FC<HomeProps> = ({ navigation }) => {
    const [form, setForm] = useState<"login" | "signup">()

    return (
        <Surface style={{ flex: 1, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center", gap: 20, paddingHorizontal: 80 }}>
            <Logo />
            {!form && (
                <Surface style={{ gap: 10, backgroundColor: "transparent", alignItems: "center" }}>
                    <Button onPress={() => setForm("login")} icon={"account-outline"}>
                        Login
                    </Button>
                    <Pressable>
                        <Text style={{ color: colors.secondary }}>
                            Ainda não tem uma conta? <Text style={{ color: colors.secondary, fontWeight: "bold" }}>Faça o cadastro</Text>{" "}
                        </Text>
                    </Pressable>
                </Surface>
            )}
            {form == "login" && <Login navigation={navigation} />}
        </Surface>
    )
}
