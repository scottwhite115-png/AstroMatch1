package com.astromatch.ios;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;

import androidx.viewpager.widget.ViewPager;

public class OnboardingActivity extends Activity {
    private static final String PREFS_NAME = "AstroMatchPrefs";
    private static final String PREF_ONBOARDING_SHOWN = "onboarding_shown";

    private ViewPager viewPager;
    private OnboardingPagerAdapter pagerAdapter;
    private Button btnNext;
    private Button btnSkip;
    private int currentPage = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Check if onboarding has already been shown
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        boolean onboardingShown = prefs.getBoolean(PREF_ONBOARDING_SHOWN, false);
        
        if (onboardingShown) {
            // Skip onboarding and go to StartActivity
            startStartActivity();
            return;
        }
        
        setContentView(R.layout.activity_onboarding);
        
        viewPager = findViewById(R.id.viewPager);
        btnNext = findViewById(R.id.btn_next);
        btnSkip = findViewById(R.id.btn_skip);
        
        pagerAdapter = new OnboardingPagerAdapter(this);
        viewPager.setAdapter(pagerAdapter);
        
        // Update button text based on page
        viewPager.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {}

            @Override
            public void onPageSelected(int position) {
                currentPage = position;
                if (position == pagerAdapter.getCount() - 1) {
                    btnNext.setText(R.string.onboarding_get_started);
                    btnSkip.setVisibility(View.GONE);
                } else {
                    btnNext.setText(R.string.onboarding_next);
                    btnSkip.setVisibility(View.VISIBLE);
                }
            }

            @Override
            public void onPageScrollStateChanged(int state) {}
        });
        
        btnNext.setOnClickListener(v -> {
            if (currentPage < pagerAdapter.getCount() - 1) {
                viewPager.setCurrentItem(currentPage + 1, true);
            } else {
                // Last page - finish onboarding
                SharedPreferences.Editor editor = prefs.edit();
                editor.putBoolean(PREF_ONBOARDING_SHOWN, true);
                editor.apply();
                startStartActivity();
            }
        });
        
        btnSkip.setOnClickListener(v -> {
            SharedPreferences.Editor editor = prefs.edit();
            editor.putBoolean(PREF_ONBOARDING_SHOWN, true);
            editor.apply();
            startStartActivity();
        });
    }
    
    private void startStartActivity() {
        Intent intent = new Intent(this, StartActivity.class);
        startActivity(intent);
        finish();
    }
}

