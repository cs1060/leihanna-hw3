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

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- npm (usually comes with Node.js)

### Project Structure
```
leihanna-hw3/
├── frontend/          # React frontend application
├── main.py           # Flask backend server
├── requirements.txt  # Python dependencies
└── .env             # Environment variables (create this)
```

### Backend Setup
1. Create and activate virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   FLASK_APP=main.py
   FLASK_ENV=development
   SECRET_KEY=your-secret-key-here
   ```

4. Start the Flask server:
   ```bash
   flask run --port 8080
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

### Troubleshooting
- If you get a CORS error, make sure both frontend and backend servers are running
- If you get module not found errors, ensure all dependencies are installed
- For microphone access issues, make sure your browser has permission to use the microphone
- If the frontend fails to start, try clearing npm cache:
  ```bash
  npm cache clean --force
  rm -rf node_modules
  npm install
  ```

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
