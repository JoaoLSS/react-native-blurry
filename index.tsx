import React, { useEffect, useState } from "react"
import { requireNativeComponent, ViewProps, Dimensions, View } from 'react-native';
import { captureScreen } from "react-native-view-shot"

const RCTBlurView = requireNativeComponent("RCTBlurView") as React.JSXElementConstructor<ViewProps & {
    radius: number,
    sampling: number,
    visible: boolean,
    source ?: string,
    color ?: string,
}>

export const BlurOverlay = (props: {
    radius: number
    sampling: number
    source ?: string
    colorOverlay ?: string
}) => {

    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setVisible(true)
        return () => setVisible(false)
    })

    return (
        <View style={{ backgroundColor: "transparent" }}>
            <RCTBlurView
                style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}
                radius={props.radius}
                sampling={props.sampling}
                visible={visible && !props.source}
                source={props.source}
                color={props.colorOverlay}
            />
        </View>
    )

}