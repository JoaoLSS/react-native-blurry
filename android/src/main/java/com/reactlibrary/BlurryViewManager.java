package com.reactlibrary;

import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.Rect;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Message;
import android.provider.MediaStore;
import android.util.Log;
import android.view.PixelCopy;
import android.view.View;
import android.view.Window;
import android.view.WindowInsets;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.image.ReactImageView;

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

    @ReactProp(name = "radius")
    public void setRadius(ReactImageView view, int radius) { this.mRadius = radius; }

    @ReactProp(name="sampling")
    public void setSampling(ReactImageView view, int sampling) { this.mSampling = sampling; }

    @ReactProp(name="visible")
    public void setVisible(ReactImageView view, boolean visible) {
        if(visible && !mVisible) {
            final Rect rect = new Rect();
            Window window = BlurryModule.mModule.getActivity().getWindow();
            window.getDecorView().getWindowVisibleDisplayFrame(rect);
            WindowInsets insets = window.getDecorView().getRootWindowInsets();
            final int height = rect.height() + insets.getStableInsetTop();
            int navBarHeight = insets.getStableInsetBottom();
            final Bitmap unscaledBitmap = Bitmap.createBitmap(rect.width(), height+navBarHeight, Bitmap.Config.ARGB_8888 );
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                PixelCopy.request(window, unscaledBitmap, new PixelCopy.OnPixelCopyFinishedListener() {
                    @Override
                    public void onPixelCopyFinished(int i) {
                        if(i==PixelCopy.SUCCESS) {
                            unscaledBitmap.reconfigure(rect.width(), height, Bitmap.Config.ARGB_8888);
                            bitmap = Bitmap.createBitmap(unscaledBitmap);
                            mVisible = true;
                            mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("RNBLURRY", true);
                        }
                    }
                }, new Handler(new Handler.Callback() {
                    @Override
                    public boolean handleMessage(Message message) {
                        Log.d("RNBLURRY", message.toString());
                        return false;
                    }
                }));
            }
            else {
                View _view = window.getDecorView();
                _view.setDrawingCacheEnabled(true);
                _view.destroyDrawingCache();
                _view.setDrawingCacheQuality(View.DRAWING_CACHE_QUALITY_LOW);
                bitmap = _view.getDrawingCache();
                mVisible = true;
                mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("RNBLURRY", true);
            }
        }
        if(!visible) {
            mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("RNBLURRY", false);
            if(bitmap != null) bitmap.recycle();
            view.setImageDrawable(null);
            view.setBackground(null);
            this.mVisible = false;
        }
    }

    @ReactProp(name="viewType")
    public void setView(ReactImageView view, String viewType) {
        if(bitmap!=null && viewType!=null) {
            if(viewType.equals("background")) {
                view.setBackground(new BitmapDrawable(mContext.getResources(), bitmap));
            }
            else {
                Blurry.with(mContext)
                        .radius(mRadius)
                        .sampling(mSampling)
                        .from(bitmap)
                        .into(view);
            }
        }
    }

//    private void setBlurred(ReactImageView view) {
//        try {
//            Blurry.with(mContext)
//                    .color(Color.parseColor(mColor))
//                    .radius(mRadius)
//                    .sampling(mSampling)
//                    .animate()
//                    .from(bitmap)
//                    .into(view);
//        }
//        catch(Exception e) {
//            Log.d("RNBLURRY", e.getMessage());
//        }
//    }
//
//    @ReactProp(name="radius")
//    public void setRadius(ReactImageView view, int radius) {
//        this.mRadius = radius;
//        if(mVisible) setBlurred(view);
//    }
//
//    @ReactProp(name="sampling")
//    public void setSampling(ReactImageView view, int sampling) {
//        this.mSampling = sampling;
//        if(mVisible) setBlurred(view);
//    }
//
//    @ReactProp(name="overlayColor")
//    public void setColor(ReactImageView view, String color) {
//        mColor = color;
//        if(mVisible) setBlurred(view);
//    }
//
//    @ReactProp(name="alpha")
//    public void setAlpha(ReactImageView view, int alpha) {
//        view.setImageAlpha(alpha);
//    }
//
//    @ReactProp(name="visible")
//    public void setVisible(final ReactImageView view, boolean visible) {
//        if(visible && !mVisible) {
//            Log.d("RNBLURRY", "overlay is visible, getting screenshot");
//            final Rect rect = new Rect();
//            Window window = BlurryModule.mModule.getActivity().getWindow();
//            window.getDecorView().getWindowVisibleDisplayFrame(rect);
//            int navBarHeight = window.getDecorView().getRootWindowInsets().getStableInsetBottom();
//            final int statusBarHeight = window.getDecorView().getRootWindowInsets().getStableInsetTop();
//            final Bitmap unscaledBitmap = Bitmap.createBitmap(rect.width(), rect.height() + navBarHeight + statusBarHeight, Bitmap.Config.ARGB_8888);
//            PixelCopy.request(window, unscaledBitmap, new PixelCopy.OnPixelCopyFinishedListener() {
//                @Override
//                public void onPixelCopyFinished(int i) {
//                    if(i==PixelCopy.SUCCESS) {
//                        unscaledBitmap.reconfigure(rect.width(), rect.height() + statusBarHeight, Bitmap.Config.ARGB_8888);
//                        bitmap = Bitmap.createBitmap(unscaledBitmap);
//                        view.setBackground(new BitmapDrawable(mContext.getResources(), bitmap));
//                        setBlurred(view);
//                        mVisible = true;
//                        mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("RNBLURRY", true);
//                    }
//                }
//            }, new Handler(new Handler.Callback() {
//                @Override
//                public boolean handleMessage(Message message) {
//                    Log.d("RNBLURRY", message.toString());
//                    return false;
//                }
//            }));
//        }
//        else if(!visible) {
//            mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("RNBLURRY", false);
//            if(bitmap != null) bitmap.recycle();
//            view.setImageDrawable(null);
//            view.setBackground(null);
//            this.mVisible = false;
//        }
//    }
//
//    @ReactProp(name="source")
//    public void setSource(ReactImageView view, String uri) {
//        Uri imageUri = Uri.parse(uri);
//        try { bitmap = MediaStore.Images.Media.getBitmap(BlurryModule.mModule.getActivity().getContentResolver(), imageUri); }
//        catch (Exception ignored) {}
//    }

}
