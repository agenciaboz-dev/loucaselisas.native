import { NavigationProp } from "@react-navigation/native"
import React from "react"
import { ScrollView } from "react-native"
import { Surface } from "react-native-paper"
import { ScreenTitle } from "../../components/ScreenTItle"
import { useFormik } from "formik"
import { CourseForm } from "../../types/server/class/Course"
import { useUser } from "../../hooks/useUser"

interface CourseFormProps {
    navigation: NavigationProp<any, any>
}

export const CourseFormComponent: React.FC<CourseFormProps> = ({ navigation }) => {
    const { user } = useUser()
    const creator = user?.creator!

    const formik = useFormik<CourseForm>({
        initialValues: {
            categories: [],
            creators: [{ id: creator.id }],
            description: "",
            gallery: { images: [], name: "", videos: [] },
            language: "",
            name: "",
            owner_id: creator.id,
            recorder: "",
            lessons: [],
        },
        async onSubmit(values, formikHelpers) {
            console.log(values)
        },
    })

    return (
        <ScrollView
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20, gap: 10 }}
        >
            <ScreenTitle title="Novo Curso" />
        </ScrollView>
    )
}
