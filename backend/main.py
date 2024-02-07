import pandas as pd
import pickle
from sklearn.metrics import classification_report
import numpy as np
import keras
import tensorflow
from keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from keras.models import Sequential
from keras.layers import Embedding, LSTM, Dense, Dropout

data_path = "emotion_60k.csv"
df = pd.read_csv(data_path)

texts = df["SENTENCE"].tolist()
labels = df["EMOTION"].tolist()

#Preprocessing
tokenizer = Tokenizer()
tokenizer.fit_on_texts(texts)
sequences = tokenizer.texts_to_sequences(texts)
max_length = max([len(seq) for seq in sequences])
padded_sequences = pad_sequences(sequences, maxlen=max_length)

label_encoder = LabelEncoder()
labels = label_encoder.fit_transform(labels)

numeric_labels = keras.utils.to_categorical(labels)

xtrain, xtest, ytrain, ytest = train_test_split(padded_sequences,
                                                numeric_labels,
                                                test_size=0.1)

#Implementing the model
model = Sequential()
model.add(Embedding(input_dim=len(tokenizer.word_index) + 1,
                    output_dim=128, input_length=max_length))
model.add(LSTM(128, return_sequences=True))
model.add(LSTM(64))
model.add(Dense(units=128, activation="relu"))
model.add(Dropout(0.5))
model.add(Dense(units=len(numeric_labels[0]), activation="softmax"))

model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])
model.fit(xtrain, ytrain, epochs=15, batch_size=128, validation_data=(xtest, ytest))

y_pred = model.predict(xtest)

# Convert the one-hot encoded predictions back to labels
y_pred_labels = np.argmax(y_pred, axis=1)
y_true_labels = np.argmax(ytest, axis=1)

# Decode the labels using the inverse of LabelEncoder
y_pred_emotions = label_encoder.inverse_transform(y_pred_labels)
y_true_emotions = label_encoder.inverse_transform(y_true_labels)

# Print the classification report
print(classification_report(y_true_emotions, y_pred_emotions))
# Save LabelEncoder
with open('label_encoder.pkl', 'wb') as le_file:
    pickle.dump(label_encoder, le_file)

# Save Tokenizer
with open('tokenizer.pkl', 'wb') as tokenizer_file:
    pickle.dump(tokenizer, tokenizer_file)
model.save("new_emotion_detection_model_with_lstm.h5")
