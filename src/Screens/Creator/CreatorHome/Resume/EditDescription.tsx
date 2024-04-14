import React, { useState } from "react"
import { IconButton, Surface, TextInput } from "react-native-paper"
import { useFormik } from "formik"
import { View } from "react-native"
import { Creator } from "../../../../types/server/class"
import { useSnackbar } from "../../../../hooks/useSnackbar"
import { useUser } from "../../../../hooks/useUser"
import { PartialCreator } from "../../../../types/server/class/Creator"
import { api } from "../../../../backend/api"

interface EditDescriptionProps {
    creator: Creator
    onDone: () => void
}

export const EditDescription: React.FC<EditDescriptionProps> = ({ creator, onDone }) => {
    const { snackbar } = useSnackbar()
    const { setUser } = useUser()

    const [loading, setLoading] = useState(false)

    const formik = useFormik<PartialCreator>({
        initialValues: { id: creator.id, description: creator.description },
        async onSubmit(values, formikHelpers) {
            if (loading) return
            setLoading(true)
            try {
                const response = await api.patch("/creator", values)
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
                label={"Descrição"}
                value={formik.values.description || ""}
                onChangeText={formik.handleChange("description")}
                numberOfLines={5}
                autoFocus
                style={{ backgroundColor: "transparent" }}
                disabled={loading}
            />
            <IconButton loading={loading} style={{ alignSelf: "flex-end" }} icon={"check"} onPress={() => formik.handleSubmit()} mode="contained" />
        </View>
    )
}
