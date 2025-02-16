# AI Interview Practice Application

A web-based mock interview platform that simulates interview scenarios and provides automated feedback. Built for CS1060 course.

## Features

- **Interactive Interview Experience**
  - Sequential interview questions
  - Real-time audio recording
  - Live speech-to-text transcription
  - Question navigation (skip/next)
  - Automated feedback generation

- **Audio Recording**
  - Browser-based audio recording
  - Microphone permission handling
  - Recording timer display
  - Manual recording control

- **Speech Recognition**
  - Real-time speech-to-text conversion
  - Live transcript display
  - Final response review
  - Transcript storage

- **User Interface**
  - Clean, modern Material-UI design
  - Responsive layout
  - Clear feedback display
  - Intuitive navigation
  - Progress tracking

## Technology Stack

### Frontend
- React
- Material-UI (MUI)
- Axios for API communication
- Web Speech API for transcription

### Backend
- Flask (Python)
- Flask-CORS for cross-origin support
- Simple in-memory session management
- File-based audio storage

## Setup Instructions

### Backend Setup
1. Create and activate virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install flask flask-cors
   ```

3. Start the Flask server:
   ```bash
   python main.py
   ```
   Server will run on http://localhost:8080

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   Application will run on http://localhost:3000

## API Endpoints

- `POST /login`
  - Start new interview session
  - Requires user name

- `GET /questions/{session_id}`
  - Get next interview question
  - Returns question or completion status

- `POST /submit/{session_id}`
  - Submit answer recording and transcript
  - Handles audio file upload

- `POST /skip/{session_id}`
  - Skip current question
  - Advances to next question

## Usage Guide

1. **Starting an Interview**
   - Enter your name to begin
   - System creates new session

2. **Answering Questions**
   - Click "Start Recording" to begin
   - Speak your answer
   - View live transcription
   - Click "Stop Recording" when finished

3. **Navigation**
   - Review feedback after each answer
   - Click "Next Question" to proceed
   - Use "Skip Question" to skip current question

4. **Feedback Review**
   - View transcribed response
   - See automated feedback scores
   - Track overall progress

## Development Notes

- Audio files stored in `uploads/` directory
- Sessions managed in memory (not persistent)
- Supports modern browsers with Web Speech API
- Requires microphone permissions

## Future Improvements

- Persistent storage for sessions and responses
- Enhanced feedback generation
- User authentication
- Multiple interview types
- Response analysis
- Progress tracking
- Export functionality

## Course Information

This project was developed for CS1060 at Harvard University.

## License

This project is part of academic coursework and is not licensed for commercial use.
