import React from "react"
import { navigation_theme, paper_theme } from "./style/theme"
import { Snackbar } from "./components/Snackbar"
import { SnackbarProvider } from "./contexts/snackbarContext"
import { PaperProvider, Text } from "react-native-paper"
import { UserProvider } from "./contexts/userContext"
import { NavigationContainer } from "@react-navigation/native"
import constants from "expo-constants"

interface ProvidersProps {
    children?: React.ReactNode
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <NavigationContainer theme={navigation_theme}>
            <PaperProvider theme={paper_theme}>
                <SnackbarProvider>
                    <UserProvider>
                        {children}
                        <Snackbar />
                        <Text style={{ position: "absolute", bottom: 5, right: 5, color: "red" }}>{constants.expoConfig?.version}</Text>
                    </UserProvider>
                </SnackbarProvider>
            </PaperProvider>
        </NavigationContainer>
    )
}
