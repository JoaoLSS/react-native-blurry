import React from "react"
import { requireNativeComponent, ViewProps } from 'react-native';

export default requireNativeComponent("RCTBlurView") as React.JSXElementConstructor<ViewProps & { radius: number, sampling: number, visible: boolean }>
