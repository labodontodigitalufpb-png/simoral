# APK Android de teste

O aplicativo Android abre o ExamOSim publicado em:

```text
https://labodontodigitalufpb-png.github.io/simoral/
```

Ele requer conexão com a internet. Como a interface é carregada do endereço público, novas versões publicadas do site ficam disponíveis no aplicativo sem gerar outro APK.

## Compilar

Use o Java incluído no Android Studio e o SDK Android local:

```bash
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"
./gradlew assembleDebug
```

O APK gerado fica em `app/build/outputs/apk/debug/app-debug.apk`.

Este é um APK de teste assinado com a chave de depuração do Android. Ele pode ser instalado diretamente, mas não deve ser enviado à Google Play.
