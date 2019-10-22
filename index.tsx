import React, { useEffect, useState } from "react"
import { requireNativeComponent, ViewProps, Dimensions, View, NativeAppEventEmitter, StatusBar } from 'react-native';
import { captureScreen } from "react-native-view-shot"

const RCTBlurView = requireNativeComponent("RCTBlurView") as React.JSXElementConstructor<ViewProps & {
    radius: number,
    sampling: number,
    visible: boolean,
    alpha ?: number,
    source ?: string,
    overlayColor ?: string
}>

export const BlurOverlay = (props: {
    radius: number
    sampling: number
    visible: boolean
    source ?: string
    overlayColor ?: string
    children ?: React.ReactNode
    alpha ?: number
}) => {

    const [reallyVisible, setReallyVisible] = useState(false)

    useEffect(() => NativeAppEventEmitter.addListener("RNBLURRY", (visible) => {
        console.log({ visible })
        setReallyVisible(visible)
    }).remove, [])

    return (
        <View style={{ backgroundColor: "transparent", width: Dimensions.get("window").width, height: Dimensions.get("window").height }}>
            <RCTBlurView
                style={{ position: "absolute", top: 0, left: 0 }}
                radius={props.radius}
                sampling={props.sampling}
                visible={props.visible && !props.source}
                source={props.source}
                overlayColor={props.overlayColor}
                alpha={props.alpha}
            />
            { props.visible && reallyVisible ? props.children : null }
        </View>
    )

}