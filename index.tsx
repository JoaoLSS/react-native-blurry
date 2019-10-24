import React, { useEffect, useState } from "react"
import { requireNativeComponent, ViewProps, Dimensions, NativeAppEventEmitter } from 'react-native'
import Reanimated from "react-native-reanimated"


const RCTBlurView = requireNativeComponent("RCTBlurView") as React.JSXElementConstructor<ViewProps & {
    radius: number,
    sampling: number,
    visible: boolean,
    viewType: "background"|"blur"|null,
    children ?: React.ReactNode
}>

export const BlurOverlay = (props: {
    radius: number
    sampling: number
    visible: boolean
    children ?: React.ReactNode
    animate: Reanimated.Node<any>
}) => {

    const [reallyVisible, setReallyVisible] = useState(false)

    const { width, height } = Dimensions.get("window")

    useEffect(() => NativeAppEventEmitter.addListener("RNBLURRY", setReallyVisible).remove, [])

    return (
        <RCTBlurView
            style={{ backgroundColor: "transparent", position: "absolute", top: 0, left: 0, width, height }}
            radius={props.radius}
            sampling={props.sampling}
            visible={props.visible}
            viewType={reallyVisible ? "background" : null}
        >
            <Reanimated.View
                style={{ opacity: props.animate }}
            >
                <RCTBlurView
                    style={{ backgroundColor: "transparent", position: "absolute", top: 0, left: 0, width, height }}
                    radius={props.radius}
                    sampling={props.sampling}
                    visible={props.visible}
                    viewType={reallyVisible ? "blur" : null}
                >
                    {props.children}
                </RCTBlurView>
            </Reanimated.View>
        </RCTBlurView>
        // <View style={{ backgroundColor: "transparent", position: "absolute", top: 0, left: 0 }}>
        //     <RCTBlurView
        //         style={{ width, height }}
        //         radius={props.radius}
        //         sampling={props.sampling}
        //         visible={props.visible && !props.source}
        //         source={props.source}
        //         overlayColor={props.overlayColor}
        //         alpha={props.alpha}
        //     />
        // </View>
    )

}