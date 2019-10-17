import { requireNativeComponent, ViewProps } from 'react-native';

export default requireNativeComponent("RCTBlurView") as React.Component<ViewProps & { radius: number, sampling: number }>
