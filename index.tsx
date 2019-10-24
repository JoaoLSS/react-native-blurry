import React, { useEffect, useState, useRef } from "react"
import { requireNativeComponent, ViewProps, Dimensions, NativeAppEventEmitter, View, StyleProp, ViewStyle, Animated } from 'react-native'
import Reanimated, { Easing } from "react-native-reanimated"

const { useCode, call, min, Value, timing, Clock } = Reanimated

const RCTBlurView = requireNativeComponent("RCTBlurView") as React.JSXElementConstructor<ViewProps & {
    radius: number,
    sampling: number,
    visible: boolean,
    viewType: "background"|"blur"|null,
    children ?: React.ReactNode
}>

export const BlurOverlay = (props: {
    style?: StyleProp<ViewStyle>
    radius: number
    sampling: number
    children ?: React.ReactNode
    animate: Reanimated.Node<number>
}) => {

    const [reallyVisible, setReallyVisible] = useState(false)
    const [visible, setVisible] = useState(false)
    const { width, height } = Dimensions.get("window")

    const reallyVisibleOpacity = useRef(new Value(0))
    const opacity = useRef(min(reallyVisibleOpacity.current, props.animate))

    useEffect(() => {
        BlurOverlay.setVisible = setVisible
        const subs = NativeAppEventEmitter.addListener("RNBLURRY", setReallyVisible)
        return () => {
            BlurOverlay.setVisible = (v: boolean) => console.log(`setVisible`, v)
            subs.remove()
        }
    }, [])

    useCode(call([props.animate, reallyVisibleOpacity.current],([anim, opacity]) => {

        console.log({ opacity })

        if(anim && !visible) setVisible(true)
        if(!anim && opacity) {
            setVisible(false)
            reallyVisibleOpacity.current.setValue(0)
        }

    }), [props.animate, reallyVisibleOpacity.current])

    useEffect(() => {
        if(reallyVisible) {

            console.log(`starting animation`)

            const config = {
                toValue: new Value(1),
                duration: 300,
                easing: Easing.inOut(Easing.cubic),
            }

            timing(reallyVisibleOpacity.current, config).start()
        }
    },[reallyVisible])

    return (
        <View style={{ backgroundColor: "transparent", position: "absolute", top: 0, left: 0, width, height }}>
            <RCTBlurView
                style={{ position: "absolute", top: 0, left: 0, width, height }}
                radius={props.radius}
                sampling={props.sampling}
                visible={visible}
                viewType={reallyVisible ? "background" : null}
            />
            <Reanimated.View style={{ backgroundColor: "transparent", opacity: opacity.current, position: "absolute", top: 0, left: 0,  width, height }}>
                <RCTBlurView
                    style={{ width, height }}
                    radius={props.radius}
                    sampling={props.sampling}
                    visible={visible}
                    viewType={reallyVisible ? "blur" : null}
                />
            </Reanimated.View>
            {   reallyVisible ?
                <View style={[{ flex: 1 }, props.style]}>
                    {props.children}
                </View>
                : null
            }
        </View>
    )

}

BlurOverlay.setVisible = (v: boolean) => console.log(`setVisible`, v)
BlurOverlay.onBlurReady = (cb: (ready: boolean) => void) => NativeAppEventEmitter.addListener("RNBLURRY", cb)