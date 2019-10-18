package com.reactlibrary;

import android.app.Activity;
import android.app.Application;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.image.ReactImageView;
import com.facebook.react.views.view.ReactViewGroup;

import javax.annotation.Nonnull;

import jp.wasabeef.blurry.Blurry;

public class BlurryViewManager extends SimpleViewManager<ReactImageView> {

    private static final String REACT_CLASS = "RCTBlurView";
    private final ReactApplicationContext mContext;
    private int mRadius = 20;
    private int mSampling = 1;

    BlurryViewManager(ReactApplicationContext reactContext) {
        this.mContext = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Nonnull
    @Override
    protected ReactImageView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new ReactImageView(reactContext, Fresco.newDraweeControllerBuilder(), null, null);
    }

    @ReactProp(name="visible")
    public void setBlurred(ReactImageView view, boolean visible) {
        if(visible) {
            View focusedView = BlurryModule.mModule.getActivity().getCurrentFocus();
            if(focusedView==null) {
                Log.d("BLURRY", "no view found");
                return;
            }
            else {
                Blurry.with(mContext)
                        .radius(mRadius)
                        .sampling(mSampling)
                        .async()
                        .capture(focusedView)
                        .into(view);
            }
        }
    }

    @ReactProp(name="radius")
    public void setRadius(ReactImageView view, int radius) {
        this.mRadius = radius;
    }

    @ReactProp(name="sampling")
    public void setSampling(ReactImageView view, int sampling) {
        this.mSampling = sampling;
    }
}
