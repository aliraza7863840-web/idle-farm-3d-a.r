package com.example

import android.annotation.SuppressLint
import android.content.Context
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.viewinterop.AndroidView
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {
  private var webView: WebView? = null

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()
    setContent {
      MyApplicationTheme {
        Surface(
          modifier = Modifier
            .fillMaxSize()
            .testTag("main_game_screen"),
          color = Color(0xFF141A16)
        ) {
          GameScreen(
            onWebViewCreated = { wv -> webView = wv }
          )
        }
      }
    }
  }

  override fun onResume() {
    super.onResume()
    webView?.onResume()
  }

  override fun onPause() {
    webView?.onPause()
    super.onPause()
  }

  override fun onDestroy() {
    webView?.destroy()
    webView = null
    super.onDestroy()
  }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun GameScreen(onWebViewCreated: (WebView) -> Unit = {}) {
  Box(
    modifier = Modifier
      .fillMaxSize()
      .background(Color(0xFF141A16))
  ) {
    AndroidView(
      modifier = Modifier
        .fillMaxSize()
        .testTag("game_webview"),
      factory = { context: Context ->
        WebView(context).apply {
          layoutParams = ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
          )
          setLayerType(View.LAYER_TYPE_HARDWARE, null)
          setBackgroundColor(0xFF141A16.toInt())

          settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            loadWithOverviewMode = true
            useWideViewPort = true
            mediaPlaybackRequiresUserGesture = false
            cacheMode = WebSettings.LOAD_DEFAULT
            safeBrowsingEnabled = false
          }

          webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
              return false
            }
          }
          webChromeClient = WebChromeClient()

          loadUrl("file:///android_asset/www/index.html")
          onWebViewCreated(this)
        }
      }
    )
  }
}

