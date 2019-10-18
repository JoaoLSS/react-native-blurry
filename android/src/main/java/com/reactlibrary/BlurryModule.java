package com.reactlibrary;

import android.app.Activity;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class BlurryModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public static BlurryModule mModule;

    public BlurryModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        BlurryModule.mModule = this;
    }

    @Override
    public String getName() {
        return "Blurry";
    }

    public Activity getActivity() {
        return getCurrentActivity();
    }

}
