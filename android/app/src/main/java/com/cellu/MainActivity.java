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
  private static boolean isAdLoaded;

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
      isAdLoaded = false;
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
            loadInterstitialAd();

          }
      });
  }

  private void setAdmobCallback() {
      mInterstitialAd.setFullScreenContentCallback(new FullScreenContentCallback(){
        @Override
        public void onAdDismissedFullScreenContent() {
          // Called when fullscreen content is dismissed.
          Log.d("TAG", "The ad was dismissed.");
        }

        @Override
        public void onAdFailedToShowFullScreenContent(AdError adError) {
          // Called when fullscreen content failed to show.
          Log.d("TAG", "The ad failed to show.");
        }

        @Override
        public void onAdShowedFullScreenContent() {
          // Called when fullscreen content is shown.
          // Make sure to set your reference to null so you don't
          // show it a second time.
          mInterstitialAd = null;
          Log.d("TAG", "The ad was shown.");
          loadInterstitialAd();
        }});
  }

  private void loadInterstitialAd() {
    AdRequest adRequest = new AdRequest.Builder().build();
    Log.d("ADMOB ---- load ---- ", "LOAD");
    InterstitialAd.load(MainActivity.this,"ca-app-pub-6408045617472378/7907523375", adRequest,
    new InterstitialAdLoadCallback() {
      @Override
      public void onAdLoaded(@NonNull InterstitialAd interstitialAd) {
          // The mInterstitialAd reference will be null until
          // an ad is loaded.
          mInterstitialAd = interstitialAd;
          setAdmobCallback();
          isAdLoaded = true;
          Log.d("ADMOB ---- SUCCESS ---- ", "SUCCESS");
      }
      @Override
      public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
          // Handle the error
          mInterstitialAd = null;
          Log.i("ADMOB ---- ERROR ---- ", loadAdError.getMessage());
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
  protected static boolean getAdStatus() {
    return isAdLoaded;
  }
}
