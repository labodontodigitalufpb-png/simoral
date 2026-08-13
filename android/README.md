# APK Android de teste

O aplicativo Android inclui a interface, os casos e as imagens do ExamOSim dentro da própria APK. A conexão com a internet continua necessária para autenticação, persistência dos resultados e recursos apoiados pelo servidor.

O build sincroniza automaticamente `index.html`, `app.js`, `styles.css`, `assets/` e os arquivos de dados necessários antes de empacotar a APK. Assim, cada mudança local da interface exige a geração de uma nova APK.

## Compilar

Use o Java incluído no Android Studio e o SDK Android local:

```bash
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"
./gradlew assembleDebug
```

O APK gerado fica em `app/build/outputs/apk/debug/app-debug.apk`.

Este é um APK de teste assinado com a chave de depuração do Android. Ele pode ser instalado diretamente, mas não deve ser enviado à Google Play.
