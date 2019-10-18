import React, { useEffect, useState } from "react"
import { requireNativeComponent, ViewProps, Dimensions } from 'react-native';
import { captureScreen } from "react-native-view-shot"

const RCTBlurView = requireNativeComponent("RCTBlurView") as React.JSXElementConstructor<ViewProps & { radius: number, sampling: number, visible: boolean, source: string }>

export const BlurOverlay = (props: {
    radius: number
    sampling: number
    visible: boolean
}) => {

    const [source, setSource] = useState("")

    useEffect(() => { captureScreen({ format: "png", quality: 0.5 }).then(setSource) },[props.visible])

    return (
        <RCTBlurView
            style={{ width: Dimensions.get("window").width, height: Dimensions.get("window").height }}
            radius={props.radius}
            sampling={props.sampling}
            visible={props.visible}
            source={source}
        />
    )

}