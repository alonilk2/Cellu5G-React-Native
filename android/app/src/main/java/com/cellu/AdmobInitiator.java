package com.cellu;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;
import com.google.android.gms.ads.*;
import androidx.annotation.NonNull;
import android.util.Log;
import android.app.Activity;
import android.os.Handler;
import android.os.Looper;
import com.facebook.react.bridge.Promise;

public class AdmobInitiator extends ReactContextBaseJavaModule {
    AdmobInitiator(ReactApplicationContext context) {
        super(context);
    }
    @Override
    public String getName() {
        return "AdmobInitiator";
    }
    @ReactMethod
    public void showAd() {
        Activity activity = getCurrentActivity();
        InterstitialAd mInterstitialAd = MainActivity.getInterstitialAd();
        if (mInterstitialAd != null) {
            new Handler(Looper.getMainLooper()).post(new Runnable() {
                @Override
                public void run () {
                    if (mInterstitialAd != null) {
                        mInterstitialAd.show(activity);
                    } else {
                    }
                }
            });
            Log.d("AdmobShow", "ad showen");
        } else {
            Log.d("TAG", "The interstitial ad wasn't ready yet.");
        }
    }
    @ReactMethod
    public void isAdLoaded(final Promise promise) {
        if(MainActivity.getAdStatus()) {
            promise.resolve("success");
        }
        promise.reject("failure");
    }
}