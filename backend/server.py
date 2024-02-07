from flask import Flask, request, jsonify
from keras.models import load_model
import numpy as np
import keras
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle

app = Flask(__name__)

loaded_model = load_model("new_emotion_detection_model_with_lstm.h5")

max_length=226

# Load Encoder
with open('label_encoder.pkl', 'rb') as le_file:
    loaded_label_encoder = pickle.load(le_file)

# Load Tokenizer
with open('tokenizer.pkl', 'rb') as tokenizer_file:
    loaded_tokenizer = pickle.load(tokenizer_file)

@app.route('/predict', methods=['POST'])
def predict_emotion():
    data = request.get_json()
    sentences = data['text']

    # Preprocess the input
    input_sequence = loaded_tokenizer.texts_to_sequences([sentences])
    input_padded_sequence = pad_sequences(input_sequence, maxlen=max_length)

    # Make prediction
    prediction = loaded_model.predict(input_padded_sequence)
    predicted_label = loaded_label_encoder.inverse_transform(np.argmax(prediction, axis=1))[0]
    
    return jsonify({'predicted_emotion': predicted_label})

if __name__ == '__main__':
    app.run(debug=True)
    

