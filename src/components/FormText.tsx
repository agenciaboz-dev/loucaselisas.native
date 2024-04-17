import React, { FocusEvent } from "react"
import { Text, TextInput, TextInputProps } from "react-native-paper"
import { DimensionValue, TextInput as OriginalInput, View } from "react-native"
import { colors } from "../style/colors"
import { FormikErrors, FormikTouched } from "formik"
import { mask as masked } from "react-native-mask-text"

export interface FormTextProps extends TextInputProps {
    name: string
    width?: DimensionValue
    flex?: number
    mask?: string | string[]
    formik: {
        values: any
        errors: FormikErrors<any>
        touched: FormikTouched<any>
        handleChange: (e: React.ChangeEvent<any>) => void
        handleBlur: {
            (e: React.FocusEvent<any, Element>): void
            <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void
        }
        setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void> | Promise<FormikErrors<any>>
    }
    transparent?: boolean
}

export const FormText = React.forwardRef<React.ElementRef<typeof OriginalInput>, FormTextProps>((props, ref) => {
    const error = !!(props.formik.touched[props.name] && props.formik.errors[props.name])
    const error_text = props.formik.errors[props.name] as string
    return (
        <View style={{ width: props.width, flex: props.flex }}>
            <Text
                variant="bodySmall"
                style={{
                    marginBottom: 5,
                    paddingLeft: 5,
                }}
            >
                {props.label}
            </Text>
            <TextInput
                ref={ref}
                {...props}
                label={undefined}
                mode="outlined"
                style={[{ backgroundColor: props.transparent ? "transparent" : colors.box, flexShrink: 0 }, props.style]}
                outlineStyle={{
                    borderRadius: 10,
                    borderColor: error ? colors.error : undefined,
                }}
                dense
                returnKeyType={props.returnKeyType || "next"}
                error={error}
                value={props.value || (props.mask ? masked(props.formik.values[props.name], props.mask) : props.formik.values[props.name] || "")}
                // @ts-ignore
                onChangeText={
                    props.onChangeText ||
                    (props.mask
                        ? (value) => props.formik.setFieldValue(props.name, masked(value, props.mask))
                        : // @ts-ignore
                          props.formik.handleChange(props.name))
                }
                onBlur={props.formik.handleBlur(props.name)}
            />
            {error && <Text style={{ color: colors.error }}>{error_text}</Text>}
        </View>
    )
})
