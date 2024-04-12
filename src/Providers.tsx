import React from "react"
import { theme } from "./style/theme"
import { Snackbar } from "./components/Snackbar"
import { SnackbarProvider } from "./contexts/snackbarContext"
import { PaperProvider } from "react-native-paper"
import { UserProvider } from "./contexts/userContext"

interface ProvidersProps {
    children?: React.ReactNode
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <PaperProvider theme={theme}>
            <SnackbarProvider>
                <UserProvider>
                    {children}
                    <Snackbar />
                </UserProvider>
            </SnackbarProvider>
        </PaperProvider>
    )
}
