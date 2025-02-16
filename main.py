from flask import Flask, jsonify, request
from flask_cors import CORS
import uuid
import os

app = Flask(__name__)
CORS(app)

# Mock database
sessions = {}
questions = [
    {"id": 1, "text": "Tell me about yourself and your background."},
    {"id": 2, "text": "What are your greatest strengths and weaknesses?"},
    {"id": 3, "text": "Where do you see yourself in five years?"},
    {"id": 4, "text": "Why do you want to work for our company?"},
    {"id": 5, "text": "Tell me about a challenging situation at work and how you handled it."}
]

# Create uploads directory if it doesn't exist
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/')
def home():
    return jsonify({"status": "ok"})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    name = data.get('name', '')
    if not name:
        return jsonify({"error": "Name is required"}), 400
    
    session_id = f"session_{len(sessions) + 1}"
    sessions[session_id] = {
        "name": name,
        "current_question": 0,
        "answers": []
    }
    
    return jsonify({
        "status": "ok",
        "session_id": session_id,
        "name": name
    })

@app.route('/questions/<session_id>', methods=['GET'])
def get_question(session_id):
    if session_id not in sessions:
        return jsonify({"error": "Invalid session"}), 404
    
    session = sessions[session_id]
    current_q = session["current_question"]
    
    if current_q >= len(questions):
        return jsonify({"completed": True})
    
    return jsonify(questions[current_q])

@app.route('/submit/<session_id>', methods=['POST'])
def submit_answer(session_id):
    if session_id not in sessions:
        return jsonify({"error": "Invalid session"}), 404

    if 'answer' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['answer']
    transcript = request.form.get('transcript', '')
    
    if audio_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save the audio file
    filename = f"{session_id}_q{sessions[session_id]['current_question']}.webm"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    audio_file.save(filepath)
    
    # Update session
    sessions[session_id]["current_question"] += 1
    sessions[session_id]["answers"].append({
        "audio_path": filepath,
        "transcript": transcript
    })
    
    return jsonify({
        "status": "ok",
        "message": "Answer recorded successfully"
    })

@app.route('/skip/<session_id>', methods=['POST'])
def skip_question(session_id):
    if session_id not in sessions:
        return jsonify({"error": "Invalid session"}), 404
    
    # Update session to skip current question
    sessions[session_id]["current_question"] += 1
    sessions[session_id]["answers"].append({
        "audio_path": None,
        "transcript": "Question skipped",
        "skipped": True
    })
    
    return jsonify({
        "status": "ok",
        "message": "Question skipped"
    })

if __name__ == '__main__':
    app.run(port=8080, debug=True)
