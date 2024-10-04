# app.py
import warnings
import json
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from sentence_transformers import SentenceTransformer

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Suppress warnings
warnings.filterwarnings("ignore", category=UserWarning)

# Load the model
model = SentenceTransformer('all-MiniLM-L6-v2')
model_filename = r"E:\PS 3-1\python-service\dt_model.pkl"
kn_classifier = joblib.load(model_filename)

tag_mapping = {
        'GENERAL_TOOL': 0,
        'IMPACT': 1,
        'ATTACK_PATTERN': 2,
        'CAMPAIGN': 3,
        'VICTIM_IDENTITY': 4,
        'ATTACK_TOOL': 5,
        'GENERAL_IDENTITY': 6,
        'MALWARE': 7,
        'COURSE_OF_ACTION': 8,
        'OBSERVED_DATA': 9,
        'INTRUSION_SET': 10,
        'THREAT_ACTOR': 11,
        'VULNERABILITY': 12,
        'INFRASTRUCTURE': 13,
        'MALWARE_ANALYSIS': 14,
        'INDICATOR': 15,
        'LOCATION': 16,
        'ATTACK_MOTIVATION': 17,
        'O': 18
    }

reverse_tag_mapping = {v: k for k, v in tag_mapping.items()}

@app.route('/get-tags', methods=['POST'])
def get_tags():
    data = request.json
    input_sentence = data.get('input', '')
    
    words = input_sentence.split()
    results = []
    for word in words:
        word_vector = model.encode(word).reshape(1, -1)
        tag_number = kn_classifier.predict(word_vector)[0]
        tag_name = reverse_tag_mapping.get(tag_number, 'Unknown')
        results.append((word, tag_name))
    
    formatted_result = [{"word": word, "tag": tag} for word, tag in results]
    return jsonify(formatted_result)

if __name__ == '__main__':
    app.run(port=5000, debug=True)  # Run on port 5000 or your preferred port
