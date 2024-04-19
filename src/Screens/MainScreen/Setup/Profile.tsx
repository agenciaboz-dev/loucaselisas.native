import { NavigationProp } from "@react-navigation/native"
import React from "react"
import { ScrollView } from "react-native"
import { Surface, Text } from "react-native-paper"
import { UserFormComponent } from "../../../components/UserForm"
import { useUser } from "../../../hooks/useUser"
import { useSnackbar } from "../../../hooks/useSnackbar"
import { User } from "../../../types/server/class"
import { ScreenTitle } from "../../../components/ScreenTItle"

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
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}
            contentContainerStyle={{ gap: 20, padding: 20 }}
        >
            <ScreenTitle title="Editar perfil" />

            <UserFormComponent submitLabel="Salvar" onSubmit={onSubmit} user={user} />
        </ScrollView>
    ) : null
}
