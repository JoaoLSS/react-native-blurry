import React, { useEffect, useState } from "react"
import { requireNativeComponent, ViewProps, Dimensions, View } from 'react-native';
import { captureScreen } from "react-native-view-shot"

const RCTBlurView = requireNativeComponent("RCTBlurView") as React.JSXElementConstructor<ViewProps & {
    radius: number,
    sampling: number,
    visible: boolean,
    source ?: string,
    overlayColor ?: string,
}>

export const BlurOverlay = (props: {
    radius: number
    sampling: number
    visible: boolean
    source ?: string
    overlayColor ?: string
}) => {

    return (
        <View style={{ backgroundColor: "transparent" }}>
            <RCTBlurView
                style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}
                radius={props.radius}
                sampling={props.sampling}
                visible={props.visible && !props.source}
                source={props.source}
                overlayColor={props.overlayColor}
            />
        </View>
    )

}