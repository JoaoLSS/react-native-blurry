import React, { useEffect, useState } from "react"
import { requireNativeComponent, ViewProps, Dimensions, View } from 'react-native';
import { captureScreen } from "react-native-view-shot"

const RCTBlurView = requireNativeComponent("RCTBlurView") as React.JSXElementConstructor<ViewProps & {
    radius: number,
    sampling: number,
    visible: boolean,
    source ?: string,
    alpha ?: number,
    red ?: number,
    green ?: number,
    blue ?: number
}>

export const BlurOverlay = (props: {
    radius: number
    sampling: number
    source ?: string
    color ?: string
}) => {

    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setVisible(true)
        if(props.color) {
            console.log(parseInt(props.color, 16))
        }
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
            />
        </View>
    )

}