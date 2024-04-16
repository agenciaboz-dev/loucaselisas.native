import * as ImagePicker from "expo-image-picker"

export const pickMedia = async (aspect?: [number, number], multiple?: boolean) => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: !multiple,
        aspect,
        quality: 1,
        base64: true,
        allowsMultipleSelection: multiple,
    })

    return result.assets ? result.assets : null
}
