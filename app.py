from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from chat import get_response

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes

# Serve the main HTML page
@app.route('/')
def home():
    return render_template('base.html')  # Ensure base.html is in the templates folder

# Endpoint for handling chat messages
@app.post("/predict")
def predict():
    data = request.get_json()
    if not data or "message" not in data:
        return jsonify({"answer": "No message received"}), 400  # Return an error if message is missing

    text = data.get("message")
    response = get_response(text)
    message = {"answer": response}
    return jsonify(message)

if __name__ == "__main__":
    app.run(debug=True)