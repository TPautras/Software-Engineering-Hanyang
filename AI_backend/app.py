# app.py
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify

model = tf.keras.models.load_model("model_effets.h5")

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True)
    try:
        conc = data["concentration"]
        weight = data["weight"]
        gender = 1 if data.get("gender", "").lower() == "male" else 0
    except KeyError as e:
        return jsonify({"error": f"Missing key {e.args[0]} in input JSON"}), 400

    if "history" in data:
        seq = data["history"] 
        seq.append({"concentration": conc, "weight": weight, "gender": data.get("gender", "male")})
        seq_input = []
        for entry in seq[-5:]:  
            g = 1 if entry.get("gender", "").lower()=="male" else 0
            seq_input.append([entry["concentration"], entry["weight"], g])
        X = np.array([seq_input], dtype=np.float32) 
    else:
        X = np.array([[conc, weight, gender]], dtype=np.float32)

    pred = model.predict(X)
    pred = pred[0].tolist() 
    return jsonify({"predicted_effect": pred[0], "predicted_sideEffect": pred[1]})
