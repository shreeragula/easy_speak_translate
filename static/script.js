const languages = {
    "af": "Afrikaans", "sq": "Albanian", "am": "Amharic", "ar": "Arabic", "hy": "Armenian",
    "az": "Azerbaijani", "eu": "Basque", "bn": "Bengali", "bs": "Bosnian", "bg": "Bulgarian",
    "ca": "Catalan", "ceb": "Cebuano", "ny": "Chichewa", "zh-cn": "Chinese (Simplified)",
    "zh-tw": "Chinese (Traditional)", "co": "Corsican", "hr": "Croatian", "cs": "Czech",
    "da": "Danish", "nl": "Dutch", "en": "English", "eo": "Esperanto", "et": "Estonian",
    "tl": "Filipino", "fi": "Finnish", "fr": "French", "gl": "Galician", "ka": "Georgian",
    "de": "German", "el": "Greek", "gu": "Gujarati", "ht": "Haitian Creole", "ha": "Hausa",
    "haw": "Hawaiian", "iw": "Hebrew", "hi": "Hindi", "hmn": "Hmong", "hu": "Hungarian",
    "is": "Icelandic", "ig": "Igbo", "id": "Indonesian", "ga": "Irish", "it": "Italian",
    "ja": "Japanese", "jw": "Javanese", "kn": "Kannada", "kk": "Kazakh", "km": "Khmer",
    "ko": "Korean", "ku": "Kurdish (Kurmanji)", "ky": "Kyrgyz", "lo": "Lao", "la": "Latin",
    "lv": "Latvian", "lt": "Lithuanian", "lb": "Luxembourgish", "mk": "Macedonian",
    "mg": "Malagasy", "ms": "Malay", "ml": "Malayalam", "mt": "Maltese", "mi": "Maori",
    "mr": "Marathi", "mn": "Mongolian", "my": "Myanmar (Burmese)", "ne": "Nepali",
    "no": "Norwegian", "or": "Odia", "ps": "Pashto", "fa": "Persian", "pl": "Polish",
    "pt": "Portuguese", "pa": "Punjabi", "ro": "Romanian", "ru": "Russian", "sm": "Samoan",
    "gd": "Scots Gaelic", "sr": "Serbian", "st": "Sesotho", "sn": "Shona", "sd": "Sindhi",
    "si": "Sinhala", "sk": "Slovak", "sl": "Slovenian", "so": "Somali", "es": "Spanish",
    "su": "Sundanese", "sw": "Swahili", "sv": "Swedish", "tg": "Tajik", "ta": "Tamil",
    "te": "Telugu", "th": "Thai", "tr": "Turkish", "uk": "Ukrainian", "ur": "Urdu",
    "ug": "Uyghur", "uz": "Uzbek", "vi": "Vietnamese", "cy": "Welsh", "xh": "Xhosa",
    "yi": "Yiddish", "yo": "Yoruba", "zu": "Zulu"
};

function populateLanguageDropdowns() {
    const fromLangSelect = document.getElementById("from-lang");
    const toLangSelect = document.getElementById("to-lang");

    for (const [code, name] of Object.entries(languages)) {
        let option = new Option(name, code);
        fromLangSelect.appendChild(option.cloneNode(true));
        toLangSelect.appendChild(option);
    }

    fromLangSelect.value = "en";
    toLangSelect.value = "es";
}

async function translateText() {
    const textInput = document.getElementById("text-input").value.trim();
    const fromLang = document.getElementById("from-lang").value;
    const toLang = document.getElementById("to-lang").value;
    const translatedTextArea = document.getElementById("translated-text");

    if (!textInput) {
        alert("Please enter text to translate.");
        return;
    }

    translatedTextArea.value = "Translating...";

    try {
        const response = await fetch('/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: textInput, src_lang: fromLang, tgt_lang: toLang })
        });

        const data = await response.json();
        if (data.translated_text) {
            translatedTextArea.value = data.translated_text;
            speakText(data.translated_text, toLang);
        } else {
            translatedTextArea.value = "Translation failed.";
        }
    } catch (error) {
        console.error("Translation error:", error);
        translatedTextArea.value = "Error translating text.";
    }
}

async function speakText(text, lang) {
    const audioPlayer = document.getElementById("audio-player");

    try {
        const response = await fetch('/text-to-speech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text, lang: lang })
        });

        const data = await response.json();
        if (data.audio_url) {
            // Force the browser to reload the new audio file
            audioPlayer.src = data.audio_url + "?t=" + new Date().getTime();
            audioPlayer.style.display = "block";
            audioPlayer.load(); // Ensure it reloads the new file
            audioPlayer.play();
        }
    } catch (error) {
        console.error("Text-to-speech error:", error);
    }
}


document.addEventListener("DOMContentLoaded", populateLanguageDropdowns);
