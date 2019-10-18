package com.reactlibrary;

import android.app.Activity;
import android.app.Application;
import android.view.View;
import android.widget.ImageView;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.view.ReactViewGroup;

import jp.wasabeef.blurry.Blurry;

public class BlurryViewManager extends ViewGroupManager<ReactViewGroup> {

    private static final String REACT_CLASS = "RCTBlurView";
    private final ReactApplicationContext mContext;
    public static Activity someActivity;
    private int mRadius = 20;
    private int mSampling = 1;

    BlurryViewManager(ReactApplicationContext reactContext) {
        this.mContext = reactContext;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected ReactViewGroup createViewInstance(ThemedReactContext reactContext) {
        return new ReactViewGroup(reactContext);
    }

    @ReactProp(name="visible")
    public void setBlurred(ReactViewGroup view, boolean visible) {
        Blurry.with(someActivity)
                .radius(25)
                .sampling(2)
                .async()
                .animate(500)
                .onto(view);
    }

    @ReactProp(name="radius")
    public void setRadius(ReactViewGroup view, int radius) {
        this.mRadius = radius;
    }

    @ReactProp(name="sampling")
    public void setSampling(ReactViewGroup view, int sampling) {
        this.mSampling = sampling;
    }
}
