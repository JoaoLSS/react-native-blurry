import React, { useEffect, useState, useRef, useCallback } from "react"
import { requireNativeComponent, ViewProps, Dimensions, NativeAppEventEmitter, View, StyleProp, ViewStyle, Animated } from 'react-native'

// const { useCode, call, min, Value, timing, Clock } = Reanimated

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
    animate: Animated.Value
    minDuration: number
}) => {

    const [reallyVisible, setReallyVisible] = useState(false)
    const [visible, setVisible] = useState(false)
    const [shouldAppear, setShouldAppear] = useState(false)
    const { width, height } = Dimensions.get("window")

    const reallyVisibleOpacity = useRef(new Animated.Value(0))
    const opacity = useRef(Animated.multiply(props.animate, reallyVisibleOpacity.current))

    useEffect(() => {
        BlurOverlay.setVisible = setVisible
        BlurOverlay.realProgress = opacity.current
        const subs = NativeAppEventEmitter.addListener("RNBLURRY", setReallyVisible)
        return () => {
            BlurOverlay.setVisible = (v: boolean) => console.log(`setVisible`, v)
            BlurOverlay.realProgress = new Animated.Value(0)
            subs.remove()
        }
    }, [])

    useEffect(() => {
        if(shouldAppear) {
            BlurOverlay._listeners.forEach(listener => listener("shouldAppear"))
            setTimeout(() => setVisible(true),0)
        }
        else {
            BlurOverlay._listeners.forEach(listener => listener("shouldDisappear"))
            setTimeout(() => setVisible(false),0)
        }
    },[shouldAppear])

    useEffect(() => {

        const subs = props.animate.addListener(({ value }) => { setShouldAppear(!!value) })
        return () => { props.animate.removeListener(subs) }

    },[])

    useEffect(() => {

        if(reallyVisible)
            Animated.timing(reallyVisibleOpacity.current, { toValue: 1, duration: props.minDuration }).start()
        // if(!visible)
        //     reallyVisibleOpacity.current.setValue(0)

        if(visible && reallyVisible) BlurOverlay._listeners.forEach(listener => listener("didAppear"))

    },[reallyVisible, visible])

    return (
        <View style={{ backgroundColor: "transparent", position: "absolute", top: 0, left: 0, width, height, zIndex: 9000 }}>
            <RCTBlurView
                style={{ position: "absolute", top: 0, left: 0, width, height }}
                radius={props.radius}
                sampling={props.sampling}
                visible={visible}
                viewType={reallyVisible ? "background" : null}
            />
            <Animated.View style={{ backgroundColor: "transparent", opacity: opacity.current, position: "absolute", top: 0, left: 0,  width, height }}>
                <RCTBlurView
                    style={{ width, height }}
                    radius={props.radius}
                    sampling={props.sampling}
                    visible={visible}
                    viewType={reallyVisible ? "blur" : null}
                />
            </Animated.View>
            {
                reallyVisible ?
                <Animated.View
                    style={[{
                        width: "100%",
                        height: "110%",
                        opacity: opacity.current,
                    }, props.style]}
                >
                    { props.children }
                </Animated.View>
                : null
            }
        </View>
    )

}

BlurOverlay._listeners = [] as ((status: "shouldAppear" | "didAppear" | "shouldDisappear") => void)[]
BlurOverlay.addListener = (listener: (status: "shouldAppear" | "didAppear" | "shouldDisappear") => void) => {
    BlurOverlay._listeners.push(listener)
    return () => {
        delete BlurOverlay._listeners[BlurOverlay._listeners.indexOf(listener)]
    }
}
BlurOverlay.setVisible = (v: boolean) => console.log(`setVisible`, v)
BlurOverlay.onBlurReady = (cb: (ready: boolean) => void) => NativeAppEventEmitter.addListener("RNBLURRY", cb)
BlurOverlay.realProgress = new Animated.Value(0) as Animated.Animated

export const BlurExcludeView: React.FunctionComponent = (props: { children ?: React.ReactNode, style?: StyleProp<ViewStyle> }) => {

    const { width, height } = Dimensions.get("window")

    const [zIndex, setZ] = useState(10000)
    useEffect(() => BlurOverlay.addListener((status) => {
            switch(status) {
                case "shouldAppear":
                    setZ(0)
                    break
                default:
                    setZ(10000)
            }
        }),[])

    return (
        <View style={[{ zIndex, position: "absolute", width, height },props.style]}>
            { props.children }
        </View>
    )
}

export const BlurIncludeView: React.FunctionComponent = (props: { children ?: React.ReactNode, style?: StyleProp<ViewStyle> }) => {

    const { width, height } = Dimensions.get("window")

    const [zIndex, setZ] = useState(0)
    useEffect(() => BlurOverlay.addListener((status) => {

        switch(status) {
            case "shouldAppear":
                setZ(10000)
                break
            default:
                setZ(0)
        }

    }),[])

    return(
        <View style={[{ zIndex, position: "absolute", width, height },props.style]}>
            { props.children }
        </View>
    )

}