import React, { useEffect, useState } from "react"
import { requireNativeComponent, ImageProps, Dimensions, View, NativeAppEventEmitter } from 'react-native';
import { captureScreen } from "react-native-view-shot"

export const BlurOverlay = requireNativeComponent("RCTBlurView") as React.JSXElementConstructor<Omit<ImageProps,"source"> & { visible: boolean }>

//  = (props: Omit<ImageProps,"source"> & { visible: boolean }) => {

//     const { width, height } = Dimensions.get("window")

//     return (
//         <View style={{ backgroundColor: "transparent", width, height }}>
//             <RCTBlurView style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }} {...props}/>
//         </View>
//     )

// }

// export const BlurOverlay = (props: {
//     radius: number
//     sampling: number
//     visible: boolean
//     source ?: string
//     overlayColor ?: string
//     children ?: React.ReactNode
// }) => {

//     const [reallyVisible, setReallyVisible] = useState(false)

//     useEffect(() => NativeAppEventEmitter.addListener("RNBLURRY", (visible) => {
//         console.log({ visible })
//         setReallyVisible(visible)
//     }).remove, [])

//     return (
//         <View style={{ backgroundColor: "transparent", width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}>
//             <RCTBlurView
//                 style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}
//                 radius={props.radius}
//                 sampling={props.sampling}
//                 visible={props.visible && !props.source}
//                 source={props.source}
//                 overlayColor={props.overlayColor}
//             />
//             { props.visible && reallyVisible ? props.children : null }
//         </View>
//     )

// }