import React, { useState } from "react"
import { IconButton, Surface, TextInput } from "react-native-paper"
import { User } from "../../types/server/class"
import { useFormik } from "formik"
import { View } from "react-native"
import { PartialUser } from "../../types/server/class/User"
import { api } from "../../backend/api"
import { useSnackbar } from "../../hooks/useSnackbar"
import { useUser } from "../../hooks/useUser"

interface EditBioProps {
    user: User
    onDone: () => void
}

export const EditBio: React.FC<EditBioProps> = ({ user, onDone }) => {
    const { snackbar } = useSnackbar()
    const { setUser } = useUser()

    const [loading, setLoading] = useState(false)

    const formik = useFormik<PartialUser>({
        initialValues: { id: user.id, bio: user.bio },
        async onSubmit(values, formikHelpers) {
            if (loading) return
            setLoading(true)
            try {
                const response = await api.patch("/user", values)
                const updated_user = response.data
                setUser(updated_user)
                onDone()
            } catch (error) {
                console.log(error)
                snackbar(JSON.stringify(error))
            } finally {
                setLoading(false)
            }
        },
    })

    return (
        <View style={{ gap: 5 }}>
            <TextInput
                mode="outlined"
                multiline
                label={"Biografia"}
                value={formik.values.bio || ""}
                onChangeText={formik.handleChange("bio")}
                numberOfLines={5}
                autoFocus
                style={{ backgroundColor: "transparent" }}
                disabled={loading}
            />
            <IconButton loading={loading} style={{ alignSelf: "flex-end" }} icon={"check"} onPress={() => formik.handleSubmit()} mode="contained" />
        </View>
    )
}
