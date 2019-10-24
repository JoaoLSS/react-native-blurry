import React, { useEffect, useState } from "react"
import { requireNativeComponent, ViewProps, Dimensions, NativeAppEventEmitter, View } from 'react-native'
import Reanimated from "react-native-reanimated"


const RCTBlurView = requireNativeComponent("RCTBlurView") as React.JSXElementConstructor<ViewProps & {
    radius: number,
    sampling: number,
    visible: boolean,
    viewType: "background"|"blur"|null,
    children ?: React.ReactNode
}>

export const BlurOverlay = (props: {
    style?: StyleSheet
    radius: number
    sampling: number
    visible: boolean
    children ?: React.ReactNode
    animate: Reanimated.Node<any>
}) => {

    const [reallyVisible, setReallyVisible] = useState(false)

    const { width, height } = Dimensions.get("window")

    useEffect(() => NativeAppEventEmitter.addListener("RNBLURRY", setReallyVisible).remove, [])

    useEffect(() => {
        console.log(`effect`)
    },[BlurOverlay.visible])

    return (
        <View style={{ backgroundColor: "transparent", position: "absolute", top: 0, left: 0, ...props.style }}>
            <RCTBlurView
                style={{ position: "absolute", top: 0, left: 0, width, height }}
                radius={props.radius}
                sampling={props.sampling}
                visible={props.visible || BlurOverlay.visible}
                viewType={reallyVisible ? "background" : null}
            />
            <Reanimated.View style={{ opacity: props.animate, position: "absolute", top: 0, left: 0 }}>
                <RCTBlurView
                    style={{ width, height }}
                    radius={props.radius}
                    sampling={props.sampling}
                    visible={props.visible || BlurOverlay.visible}
                    viewType={reallyVisible ? "blur" : null}
                />
            </Reanimated.View>
            { reallyVisible ? props.children : null }
        </View>
    )

}

BlurOverlay.visible = false
BlurOverlay.setVisible = (v: boolean) => {
    console.log(`setVisible`, v)
    BlurOverlay.visible = v
    console.log({ setted: BlurOverlay.visible })
}
BlurOverlay.onBlurReady = (cb: (ready: boolean) => void) => NativeAppEventEmitter.addListener("RNBLURRY", cb)