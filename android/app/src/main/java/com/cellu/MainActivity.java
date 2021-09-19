package com.cellu;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import android.content.Intent;
import android.content.res.Configuration;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.initialization.AdapterStatus;
import com.google.android.gms.ads.initialization.InitializationStatus;
import com.google.android.gms.ads.initialization.OnInitializationCompleteListener;
import android.os.Bundle; // required for onCreate parameter
import android.util.Log;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;
import com.google.android.gms.ads.*;
import androidx.annotation.NonNull;
import java.util.Map;
import java.util.HashMap;
public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  private static InterstitialAd mInterstitialAd;

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
      super.onConfigurationChanged(newConfig);
      Intent intent = new Intent("onConfigurationChanged");
      intent.putExtra("newConfig", newConfig);
      this.sendBroadcast(intent);
  }
  @Override
  protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);

      MobileAds.initialize(this, new OnInitializationCompleteListener() {
          @Override
          public void onInitializationComplete(InitializationStatus initializationStatus) {
            Map<String, AdapterStatus> statusMap = initializationStatus.getAdapterStatusMap();
            for (String adapterClass : statusMap.keySet()) {
                AdapterStatus status = statusMap.get(adapterClass);
                Log.d("MyApp", String.format(
                        "Adapter name: %s, Description: %s, Latency: %d",
                        adapterClass, status.getDescription(), status.getLatency()));
            }
            AdRequest adRequest = new AdRequest.Builder().build();
            InterstitialAd.load(MainActivity.this,"ca-app-pub-6408045617472378/7907523375", adRequest,
            new InterstitialAdLoadCallback() {
              @Override
              public void onAdLoaded(@NonNull InterstitialAd interstitialAd) {
                  // The mInterstitialAd reference will be null until
                  // an ad is loaded.
                  mInterstitialAd = interstitialAd;
                  Log.i("adloaded", "onAdLoaded");
              }
              @Override
              public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                  // Handle the error
                  Log.i("adnotloaded", loadAdError.getMessage());
                  mInterstitialAd = null;
              }
            });
          }
      });
  }
  @Override
  protected String getMainComponentName() {
    return "Cellu";
  }
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }
  protected static InterstitialAd getInterstitialAd() {
        if(mInterstitialAd != null) return mInterstitialAd;
        return null;
  }
  protected static void setInterstitialAd(InterstitialAd newad) {
        mInterstitialAd = newad;
  }
}
