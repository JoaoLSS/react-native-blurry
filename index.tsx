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
    const [visible, setVisible] = useState(props.visible)
    const { width, height } = Dimensions.get("window")


    useEffect(() => {
        console.log(`first effect`)
        BlurOverlay.setVisible = (v: boolean) => {
            console.log(`state`)
            setVisible(v)
        }
        return NativeAppEventEmitter.addListener("RNBLURRY", setReallyVisible).remove
    }, [])

    useEffect(() => setVisible(props.visible),[props.visible])

    return (
        <View style={{ backgroundColor: "transparent", position: "absolute", top: 0, left: 0, ...props.style }}>
            <RCTBlurView
                style={{ position: "absolute", top: 0, left: 0, width, height }}
                radius={props.radius}
                sampling={props.sampling}
                visible={visible}
                viewType={reallyVisible ? "background" : null}
            />
            <Reanimated.View style={{ opacity: props.animate, position: "absolute", top: 0, left: 0 }}>
                <RCTBlurView
                    style={{ width, height }}
                    radius={props.radius}
                    sampling={props.sampling}
                    visible={visible}
                    viewType={reallyVisible ? "blur" : null}
                />
            </Reanimated.View>
            { reallyVisible ? props.children : null }
        </View>
    )

}

BlurOverlay.setVisible = (v: boolean) => console.log(`setVisible`, v)
BlurOverlay.onBlurReady = (cb: (ready: boolean) => void) => NativeAppEventEmitter.addListener("RNBLURRY", cb)