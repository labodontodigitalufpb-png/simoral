package br.ufpb.labodigit.examosim;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.Settings;
import android.util.Base64;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.URLUtil;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class MainActivity extends Activity {
    private static final String APP_URL = "https://labodontodigitalufpb-png.github.io/simoral/";
    private static final String APP_HOST = "labodontodigitalufpb-png.github.io";
    private static final String APP_PATH = "/simoral/";
    private WebView webView;

    @SuppressLint({"SetJavaScriptEnabled", "JavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(Color.rgb(15, 95, 95));

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setUserAgentString(settings.getUserAgentString() + " ExamOSimAndroid/1.4");

        webView.addJavascriptInterface(new DownloadBridge(this), "ExamOSimAndroid");
        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                WebResourceResponse localResponse = localAssetResponse(request.getUrl());
                return localResponse != null ? localResponse : super.shouldInterceptRequest(view, request);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if ("https".equals(uri.getScheme()) && isTrustedHost(uri.getHost())) return false;
                startActivity(new Intent(Intent.ACTION_VIEW, uri));
                return true;
            }
        });
        webView.setDownloadListener(createDownloadListener());

        if (savedInstanceState == null) {
            if (hasNetwork()) webView.loadUrl(APP_URL);
            else showOfflinePage();
        } else {
            webView.restoreState(savedInstanceState);
        }
    }

    private boolean isTrustedHost(String host) {
        return APP_HOST.equals(host) || "simoral.onrender.com".equals(host);
    }

    private WebResourceResponse localAssetResponse(Uri uri) {
        if (!"https".equals(uri.getScheme()) || !APP_HOST.equals(uri.getHost()) || !uri.getPath().startsWith(APP_PATH)) {
            return null;
        }
        String assetPath = uri.getPath().substring(APP_PATH.length());
        if (assetPath.isEmpty()) assetPath = "index.html";
        try {
            InputStream stream = getAssets().open(assetPath);
            return new WebResourceResponse(mimeTypeFor(assetPath), "UTF-8", stream);
        } catch (IOException error) {
            return null;
        }
    }

    private static String mimeTypeFor(String path) {
        String lower = path.toLowerCase();
        if (lower.endsWith(".html")) return "text/html";
        if (lower.endsWith(".css")) return "text/css";
        if (lower.endsWith(".js")) return "text/javascript";
        if (lower.endsWith(".json")) return "application/json";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".svg")) return "image/svg+xml";
        return "application/octet-stream";
    }

    private DownloadListener createDownloadListener() {
        return (url, userAgent, contentDisposition, mimeType, contentLength) -> {
            if (url.startsWith("blob:")) {
                String safeMime = mimeType == null || mimeType.isBlank() ? "text/csv" : mimeType;
                String script = "(async()=>{const r=await fetch(" + quoteJs(url) + ");const b=await r.blob();" +
                        "const f=new FileReader();f.onloadend=()=>ExamOSimAndroid.saveBase64(String(f.result)," +
                        quoteJs(safeMime) + "," + quoteJs("examosim-avaliacoes.csv") + ");f.readAsDataURL(b)})()";
                webView.evaluateJavascript(script, null);
                return;
            }
            try {
                DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
                request.addRequestHeader("User-Agent", userAgent);
                request.setMimeType(mimeType);
                request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                request.setDestinationInExternalPublicDir(
                        Environment.DIRECTORY_DOWNLOADS,
                        URLUtil.guessFileName(url, contentDisposition, mimeType)
                );
                ((DownloadManager) getSystemService(DOWNLOAD_SERVICE)).enqueue(request);
                Toast.makeText(this, "Download iniciado.", Toast.LENGTH_SHORT).show();
            } catch (Exception error) {
                Toast.makeText(this, "Não foi possível iniciar o download.", Toast.LENGTH_LONG).show();
            }
        };
    }

    private static String quoteJs(String value) {
        return "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
    }

    private boolean hasNetwork() {
        ConnectivityManager manager = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
        NetworkCapabilities capabilities = manager.getNetworkCapabilities(manager.getActiveNetwork());
        return capabilities != null && capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);
    }

    private void showOfflinePage() {
        webView.loadDataWithBaseURL(null,
                "<html><meta name='viewport' content='width=device-width'><body style='font-family:sans-serif;padding:32px'>" +
                "<h2>Sem conexão</h2><p>Conecte o dispositivo à internet e abra novamente o ExamOSim.</p></body></html>",
                "text/html", "UTF-8", null);
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    private static class DownloadBridge {
        private final Context context;

        DownloadBridge(Context context) {
            this.context = context;
        }

        @JavascriptInterface
        public void saveBase64(String dataUrl, String mimeType, String filename) {
            try {
                String encoded = dataUrl.substring(dataUrl.indexOf(',') + 1);
                byte[] bytes = Base64.decode(encoded, Base64.DEFAULT);
                File directory = context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
                File output = new File(directory, filename);
                try (FileOutputStream stream = new FileOutputStream(output)) {
                    stream.write(bytes);
                }
                Toast.makeText(context, "CSV salvo em " + output.getAbsolutePath(), Toast.LENGTH_LONG).show();
            } catch (IOException | RuntimeException error) {
                Toast.makeText(context, "Não foi possível salvar o CSV.", Toast.LENGTH_LONG).show();
            }
        }
    }
}
