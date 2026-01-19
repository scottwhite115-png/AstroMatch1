package com.astromatch.ios;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Button;

public class StartActivity extends Activity {
    private static final String PREFS_NAME = "AstroMatchPrefs";
    private static final String PREF_START_SHOWN = "start_shown";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_start);

        Button startButton = findViewById(R.id.btn_start_app);

        startButton.setOnClickListener(v -> {
            // Mark start screen as shown
            SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
            SharedPreferences.Editor editor = prefs.edit();
            editor.putBoolean(PREF_START_SHOWN, true);
            editor.apply();

            // Start MainActivity (Capacitor WebView)
            Intent intent = new Intent(this, MainActivity.class);
            startActivity(intent);
            finish();
        });
    }
}

