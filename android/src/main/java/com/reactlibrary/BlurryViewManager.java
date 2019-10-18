package com.reactlibrary;

import android.app.Activity;
import android.app.Application;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
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
    private boolean mVisible = false;
    private Bitmap bitmap;

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
        return new ReactImageView(reactContext, Fresco.newDraweeControllerBuilder(), null, mContext);
    }

    private void setBlurred(ReactImageView view) {
        try {
            if(bitmap==null) {
                return;
//                View focusedView = BlurryModule.mModule.getActivity().getWindow().getDecorView().findViewById(android.R.id.content);
//                if(focusedView!=null) {
//                    focusedView.setDrawingCacheEnabled(true);
//                    focusedView.destroyDrawingCache();
//                    focusedView.setDrawingCacheQuality(View.DRAWING_CACHE_QUALITY_LOW);
//                    bitmap = focusedView.getDrawingCache();
//                }
            }
            Blurry.with(mContext)
                    .radius(mRadius)
                    .sampling(mSampling)
                    .from(bitmap)
                    .into(view);
        }
        catch(Exception ignored) {

        }
    }

    private void unsetBlurred(ReactImageView view) {
        if(bitmap!=null) {
            View focusedView = BlurryModule.mModule.getActivity().getWindow().getDecorView().findViewById(android.R.id.content);
            if(focusedView!=null) {
                Blurry.delete((ViewGroup)focusedView);
                bitmap = null;
            }
        }
    }

    @ReactProp(name="radius")
    public void setRadius(ReactImageView view, int radius) {
        this.mRadius = radius;
        if(mVisible) setBlurred(view);
    }

    @ReactProp(name="sampling")
    public void setSampling(ReactImageView view, int sampling) {
        this.mSampling = sampling;
        if(mVisible) setBlurred(view);
    }

    @ReactProp(name="visible")
    public void setVisible(ReactImageView view, boolean visible) {
        this.mVisible = visible;
        if(visible) setBlurred(view);
        else unsetBlurred(view);
    }

    @ReactProp(name="source")
    public void setSource(ReactImageView view, String uri) {
        Uri imageUri = Uri.parse(uri);
        try {
            bitmap = MediaStore.Images.Media.getBitmap(BlurryModule.mModule.getActivity().getContentResolver(), imageUri);
        }
        catch (Exception ignored) {

        }
    }

}
