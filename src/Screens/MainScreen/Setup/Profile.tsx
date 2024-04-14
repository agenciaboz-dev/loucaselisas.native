import { NavigationProp } from "@react-navigation/native"
import React from "react"
import { ScrollView } from "react-native"
import { Surface, Text } from "react-native-paper"
import { UserFormComponent } from "../../../components/UserForm"
import { useUser } from "../../../hooks/useUser"
import { useSnackbar } from "../../../hooks/useSnackbar"
import { User } from "../../../types/server/class"

interface ProfileProps {
    navigation: NavigationProp<any, any>
}

export const Profile: React.FC<ProfileProps> = ({ navigation }) => {
    const { setUser, user } = useUser()
    const { snackbar } = useSnackbar()

    const onSubmit = (user: User) => {
        setUser(user)
        snackbar("Salvo com sucesso")
        navigation.goBack()
    }

    return user ? (
        <ScrollView
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1, padding: 20, paddingBottom: 0 }}
            contentContainerStyle={{ gap: 20 }}
        >
            <Text variant="titleLarge" style={{ alignSelf: "center" }}>
                Editar perfil
            </Text>

            <UserFormComponent submitLabel="Salvar" onSubmit={onSubmit} user={user} />
        </ScrollView>
    ) : null
}
