import React, { useEffect, useState } from "react"
import { requireNativeComponent, ViewProps, Dimensions, View } from 'react-native';
import { captureScreen } from "react-native-view-shot"

const RCTBlurView = requireNativeComponent("RCTBlurView") as React.JSXElementConstructor<ViewProps & {
    radius: number,
    sampling: number,
    visible: boolean,
    source ?: string,
    overlayColor ?: string
}>

export const BlurOverlay = (props: {
    radius: number
    sampling: number
    visible: boolean
    source ?: string
    overlayColor ?: string
    children: React.ReactNode
}) => {

    return (
        <View style={{ backgroundColor: "transparent", width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}>
            <RCTBlurView
                style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}
                radius={props.radius}
                sampling={props.sampling}
                visible={props.visible && !props.source}
                source={props.source}
                overlayColor={props.overlayColor}
            />
            { props.visible ? props.children : null }
        </View>
    )

}