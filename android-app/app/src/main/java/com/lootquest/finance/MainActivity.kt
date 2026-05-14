package com.lootquest.finance

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import android.webkit.*
import androidx.appcompat.app.AppCompatActivity
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewAssetLoader.AssetsPathHandler
import androidx.webkit.WebViewClientCompat
import java.io.InputStream
import android.net.Uri

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        // Handle the splash screen transition.
        installSplashScreen()
        
        super.onCreate(savedInstanceState)

        // Fullscreen immersive mode with dark status/nav bars
        WindowCompat.setDecorFitsSystemWindows(window, false)
        window.statusBarColor = android.graphics.Color.parseColor("#0A0A0F")
        window.navigationBarColor = android.graphics.Color.parseColor("#0A0A0F")

        val controller = WindowInsetsControllerCompat(window, window.decorView)
        controller.isAppearanceLightStatusBars = false
        controller.isAppearanceLightNavigationBars = false

        // Keep screen on while app is active
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        // Create WebView programmatically
        webView = WebView(this).apply {
            layoutParams = android.view.ViewGroup.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                android.view.ViewGroup.LayoutParams.MATCH_PARENT
            )
            setBackgroundColor(android.graphics.Color.parseColor("#0A0A0F"))
        }

        setContentView(webView)

        // Configure WebView settings
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            cacheMode = WebSettings.LOAD_DEFAULT
            setSupportZoom(false)
            builtInZoomControls = false
            displayZoomControls = false
            useWideViewPort = true
            loadWithOverviewMode = true
            mediaPlaybackRequiresUserGesture = false
            textZoom = 100
        }

        // Create the Asset Loader with root path handler
        val assetLoader = WebViewAssetLoader.Builder()
            .setDomain("appassets.androidplatform.net")
            .addPathHandler("/", AssetsPathHandler(this))
            .build()

        // File extensions that correspond to real asset files (not SPA routes)
        val assetExtensions = setOf(
            ".js", ".css", ".html", ".png", ".jpg", ".jpeg", ".gif", ".svg",
            ".ico", ".woff", ".woff2", ".ttf", ".eot", ".json", ".map",
            ".webp", ".mp4", ".webm", ".ogg", ".mp3", ".wav"
        )

        // Handle navigation and asset loading within the WebView
        webView.webViewClient = object : WebViewClientCompat() {
            override fun shouldInterceptRequest(
                view: WebView?,
                request: WebResourceRequest?
            ): WebResourceResponse? {
                if (request == null) return null
                
                val url = request.url
                
                // Only intercept requests to our asset domain
                if (url?.host != "appassets.androidplatform.net") return null

                val path = url.path ?: "/"
                
                // Check if this is a request for a real asset file (has a file extension)
                val isAssetFile = assetExtensions.any { path.lowercase().endsWith(it) }
                
                if (isAssetFile) {
                    // Let the asset loader handle real files (JS, CSS, images, etc.)
                    return assetLoader.shouldInterceptRequest(url)
                }
                
                // For all other paths (SPA routes like /, /auth, /onboarding, /admin),
                // serve index.html so React Router can handle client-side routing
                try {
                    val inputStream: InputStream = assets.open("index.html")
                    return WebResourceResponse("text/html", "UTF-8", inputStream)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
                
                return null
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                // Inject viewport meta tag to ensure proper scaling
                view?.evaluateJavascript(
                    """
                    (function() {
                        var meta = document.querySelector('meta[name="viewport"]');
                        if (!meta) {
                            meta = document.createElement('meta');
                            meta.name = 'viewport';
                            document.head.appendChild(meta);
                        }
                        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
                    })();
                    """.trimIndent(),
                    null
                )
            }
        }

        // Handle JavaScript alerts and console logging
        webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
                android.util.Log.d(
                    "LootQuest",
                    "${consoleMessage?.message()} -- Line ${consoleMessage?.lineNumber()} of ${consoleMessage?.sourceId()}"
                )
                return true
            }
        }

        // Load the root path — React Router will handle routing from here
        webView.loadUrl("https://appassets.androidplatform.net/")
    }

    // Handle back button navigation within WebView
    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            @Suppress("DEPRECATION")
            super.onBackPressed()
        }
    }
}

