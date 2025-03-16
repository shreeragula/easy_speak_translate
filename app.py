from flask import Flask, render_template, request, jsonify
from googletrans import Translator
from gtts import gTTS
import os
import time

app = Flask(__name__)
translator = Translator()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.json
    text = data.get("text", "").strip()
    src_lang = data.get("src_lang", "auto")
    tgt_lang = data.get("tgt_lang")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        translated = translator.translate(text, src=src_lang, dest=tgt_lang)
        return jsonify({"translated_text": translated.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    data = request.json
    text = data.get("text")
    lang = data.get("lang")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Generate a unique filename for each request
    timestamp = int(time.time() * 1000)  # Unique timestamp
    audio_filename = f"speech_{timestamp}.mp3"
    audio_path = os.path.join("static", audio_filename)

    # Convert text to speech
    tts = gTTS(text=text, lang=lang)
    tts.save(audio_path)

    return jsonify({"audio_url": f"/static/{audio_filename}"})

if __name__ == '__main__':
    app.run(debug=True)
