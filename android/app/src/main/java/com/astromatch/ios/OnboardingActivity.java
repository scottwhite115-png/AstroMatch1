package com.astromatch.ios;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Button;

public class OnboardingActivity extends Activity {
    private static final String PREFS_NAME = "AstroMatchPrefs";
    private static final String PREF_ONBOARDING_SHOWN = "onboarding_shown";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Check if onboarding has already been shown
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        boolean onboardingShown = prefs.getBoolean(PREF_ONBOARDING_SHOWN, false);
        
        if (onboardingShown) {
            // Skip onboarding and go directly to MainActivity
            startMainActivity();
            return;
        }
        
        setContentView(R.layout.activity_onboarding);
        
        Button startButton = findViewById(R.id.btn_start);
        
        startButton.setOnClickListener(v -> {
            // Mark onboarding as shown
            SharedPreferences.Editor editor = prefs.edit();
            editor.putBoolean(PREF_ONBOARDING_SHOWN, true);
            editor.apply();
            
            // Start MainActivity (Capacitor BridgeActivity)
            startMainActivity();
        });
    }
    
    private void startMainActivity() {
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
        finish();
    }
}

