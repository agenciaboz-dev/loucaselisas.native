import { useFormik } from "formik"
import React, { useEffect, useRef, useState } from "react"
import { Icon, Surface, Text, TextInput as PaperInput, Avatar } from "react-native-paper"
import { User, UserForm } from "../../types/server/class"
import { colors } from "../../style/colors"
import { FormText } from "../../components/FormText"
import { Keyboard, KeyboardAvoidingView, Pressable, ScrollView, TextInput, View } from "react-native"
import { Dropdown, IDropdownRef } from "react-native-element-dropdown"
import DatePicker from "react-native-date-picker"
import { estados } from "../../tools/estadosBrasil"
import { dropdown_style } from "../../style/dropdown_style"
import { Button } from "../../components/Button"
import { useSignupSchema } from "../../hooks/useSignupSchema"
import * as ImagePicker from "expo-image-picker"
import unmask from "../../tools/unmask"
import { api } from "../../backend/api"
import { useUser } from "../../hooks/useUser"
import { AxiosError } from "axios"
import { useSnackbar } from "../../hooks/useSnackbar"
import { UserFormComponent } from "../../components/UserForm"
import { ScreenTitle } from "../../components/ScreenTItle"
import placeholders from "../../tools/placeholders"

interface SignupProps {}

export const Signup: React.FC<SignupProps> = ({}) => {
    const { onLogin } = useUser()
    const { snackbar } = useSnackbar()

    const [image, setImage] = useState<ImagePicker.ImagePickerAsset>()

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true,
        })

        if (!result.canceled) {
            setImage(result.assets[0])
        }
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1, paddingBottom: 0 }}
            contentContainerStyle={{ gap: 20, padding: 20, paddingTop: 40 }}
        >
            <ScreenTitle title="Cadastre-se" />

            <View style={{ alignItems: "center", gap: 10 }}>
                <Avatar.Image size={150} source={image ? { uri: image.uri } : placeholders.avatar} />
                <Button mode="contained" style={{ width: 150 }} onPress={() => pickImage()}>
                    Inserir foto
                </Button>
            </View>

            <UserFormComponent
                submitLabel="Cadastrar-se"
                onSubmit={onLogin}
                externalData={{
                    image: image
                        ? {
                              name: image?.uri.substring(image?.uri.lastIndexOf("/") + 1, image?.uri.length) || "profile.png",
                              base64: image.base64 as string,
                          }
                        : null,
                }}
            />
        </ScrollView>
    )
}
