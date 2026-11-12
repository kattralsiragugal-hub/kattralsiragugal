நாட்காட்டி வடிவமைப்பாளர் – PWA / Play Store தொகுப்பு
=====================================================

கோப்புகள்
---------
index.html            முழுச் செயலி (எல்லா வசதிகளும்)
manifest.json         செயலிப் பெயர், ஐகான்கள், நிறங்கள்
sw.js                 ஆஃப்லைன் சேவை (service worker)
privacy-policy.html   தனியுரிமைக் கொள்கை (Play Console-க்கு இந்த முகவரி தேவை)
icons/                192, 512, maskable 512, apple-touch ஐகான்கள்
.well-known/assetlinks.json   TWA-க்கான வார்ப்புரு (கடைசிப் படியில் நிரப்பவும்)
../play-store-icon-512.png    Play Store பட்டியலுக்கான 512×512 ஐகான்

முன் செய்ய வேண்டியவை
--------------------
1. privacy-policy.html-ல் [உங்கள் பெயர்], [உங்கள் மின்னஞ்சல்], [தேதி] ஆகியவற்றை மாற்றவும்.
2. இந்தக் கோப்புறை முழுவதையும் HTTPS இணையத்தில் ஏற்றவும் (Netlify / Cloudflare Pages / GitHub Pages).
   - .well-known கோப்புறை தளத்தின் ROOT-ல் இருக்க வேண்டும்:
     https://உங்கள்தளம்/.well-known/assetlinks.json
   - GitHub Pages-ல் "username.github.io" என்ற தனிக் களஞ்சியம் அல்லது சொந்த டொமைன் தேவை.
3. Chrome-ல் தளத்தைத் திறந்து, DevTools → Application → Manifest / Service Workers சரியாக உள்ளதா பார்க்கவும்.
   ஒருமுறை இணையத்தில் திறந்த பின் இணையத்தை அணைத்தும் திறக்கிறதா சோதிக்கவும்.

AAB உருவாக்கம்
--------------
1. pwabuilder.com → உங்கள் முகவரி → Package for stores → Android.
2. Package ID எ.கா: com.உங்கள்பெயர்.tamilcalendar (எழுத்துகள் சிறியவை, ஆங்கிலம்).
3. Signing key உருவாக்கி, அந்த key file + password-ஐ பாதுகாப்பாக வைக்கவும் (இழந்தால் புதுப்பிக்க முடியாது).
4. கிடைக்கும் ZIP-ல் .aab கோப்பும் assetlinks.json-ல் ஒட்ட வேண்டிய SHA-256 கைரேகையும் இருக்கும்.
   (Play App Signing பயன்படுத்தினால் Play Console → App integrity-ல் உள்ள கைரேகையையும் சேர்க்கவும்.)
5. அந்த கைரேகையை .well-known/assetlinks.json-ல் ஒட்டி, package_name-ஐயும் பொருத்தி, தளத்தில் மீண்டும் ஏற்றவும்.
6. targetSdk 36 அல்லது அதற்கு மேல் உள்ளதா பார்க்கவும் (Play தேவை).

Play Console
------------
- Internal testing → Closed testing (தனிநபர் புதிய கணக்கு: 12 சோதனையாளர்கள் × 14 நாட்கள்) → Production.
- Store listing: 512×512 ஐகான், 1024×500 feature graphic, குறைந்தது 2 தொலைபேசி screenshots.
- Privacy Policy முகவரி: https://உங்கள்தளம்/privacy-policy.html
- Data safety: படங்கள் சாதனத்திலேயே செயல்படுவதால் பயனர் தரவு சேகரிப்பு இல்லை. ஆனால் Google Fonts ஏற்றப்படுவதால்
  (IP முகவரி Google-க்குச் செல்லும்) படிவத்தைப் பார்த்து நேர்மையாக நிரப்பவும்; முழுமையாக "தரவு இல்லை" என்று சொல்ல
  விரும்பினால் கீழே உள்ள "எழுத்துருக்களைத் தனியாக வைத்தல்" படியைச் செய்யவும்.

எழுத்துருக்களைத் தனியாக வைத்தல் (விருப்பம்)
-------------------------------------------
இப்போது Google Fonts முதல் முறை இணையத்தில் ஏற்றப்பட்டு, service worker அவற்றைச் சேமித்து ஆஃப்லைனில் தரும்.
முழுக்க உங்கள் தளத்திலிருந்தே வழங்க: Noto Sans Tamil, Noto Serif Tamil, Baloo Thambi 2, Mukta Malar
(எல்லாம் SIL OFL உரிமம்) .woff2 கோப்புகளைப் பதிவிறக்கி fonts/ கோப்புறையில் வைத்து, index.html-ல்
Google Fonts <link> வரியை நீக்கி @font-face விதிகளைச் சேர்த்து, sw.js SHELL பட்டியலில் அந்தக் கோப்புகளையும் சேர்க்கவும்.

புதுப்பிக்கும்போது
-----------------
index.html மாற்றினால் sw.js-ல் VERSION = "v1" → "v2" என உயர்த்தவும்; இல்லையெனில் பழைய பதிப்பு தெரியும்.
