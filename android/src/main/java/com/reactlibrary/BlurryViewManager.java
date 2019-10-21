package com.reactlibrary;

import android.app.Activity;
import android.app.Application;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.net.Uri;
import android.os.Handler;
import android.os.Message;
import android.provider.MediaStore;
import android.util.Log;
import android.view.PixelCopy;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
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

    private void setBlurred(final ReactImageView view) {
        try {
            if(bitmap==null) {
                Window focusedWindow = BlurryModule.mModule.getActivity().getWindow();
                if(focusedWindow!=null) {
                    Log.d("RNBLURRY", "taking screenshot");
                    PixelCopy.request(focusedWindow, bitmap, new PixelCopy.OnPixelCopyFinishedListener() {
                        @Override
                        public void onPixelCopyFinished(int i) {
                            Log.d("RNBLURRY", "COPY FINISHED");
                            switch (i) {
                                case PixelCopy.ERROR_DESTINATION_INVALID: {
                                    Log.d("RNBLURRY", "ERROR_DESTINATION_INVALID");
                                    break;
                                }
                                case PixelCopy.ERROR_SOURCE_INVALID: {
                                    Log.d("RNBLURRY", "ERROR_SOURCE_INVALID");
                                    break;
                                }
                                case PixelCopy.ERROR_SOURCE_NO_DATA: {
                                    Log.d("RNBLURRY", "ERROR_SOURCE_NO_DATA");
                                    break;
                                }
                                case PixelCopy.ERROR_TIMEOUT: {
                                    Log.d("RNBLURRY", "ERROR_TIMEOUT");
                                    break;
                                }
                                case PixelCopy.ERROR_UNKNOWN: {
                                    Log.d("RNBLURRY", "ERROR_UNKNOWN");
                                    break;
                                }
                                case PixelCopy.SUCCESS: {
                                    Log.d("RNBLURRY", "SUCCESS");
                                    Blurry.with(mContext)
                                        .radius(mRadius)
                                        .sampling(mSampling)
                                        .from(bitmap)
                                        .into(view);
                                    break;
                                }
                            }
                        }
                    }, new Handler(new Handler.Callback() {
                        @Override
                        public boolean handleMessage(Message message) {
                            Log.d("PIXEL.COPY", message.toString());
                            return false;
                        }
                    }));
                }
            }

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
