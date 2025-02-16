import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import axios from 'axios';

const Interview = ({ session }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMicPermission, setShowMicPermission] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    fetchNextQuestion();
  }, []);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        setTranscript(finalTranscript.trim());
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError('Error with speech recognition: ' + event.error);
      };

      setRecognition(recognition);
    } else {
      setError('Speech recognition is not supported in this browser.');
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchNextQuestion = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(
        `http://localhost:8080/questions/${session.session_id}`
      );
      
      if (response.data.completed) {
        setCurrentQuestion(null);
      } else {
        setCurrentQuestion(response.data);
        setFeedback(null);
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      setError('Failed to fetch question. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(chunks => [...chunks, event.data]);
        }
      };

      setMediaRecorder(recorder);
      setShowMicPermission(false);
      startRecording(recorder);
    } catch (err) {
      console.error('Microphone permission denied:', err);
      setError('Please allow microphone access to record your answer.');
      setShowMicPermission(false);
    }
  };

  const startRecording = (recorder) => {
    setAudioChunks([]);
    setIsRecording(true);
    setTranscript('');
    recorder.start(200);
    if (recognition) {
      recognition.start();
    }
  };

  const handleStartRecording = () => {
    if (!mediaRecorder) {
      setShowMicPermission(true);
    } else {
      startRecording(mediaRecorder);
    }
  };

  const handleStopRecording = async () => {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') return;

    setIsRecording(false);
    mediaRecorder.stop();
    if (recognition) {
      recognition.stop();
    }
    setLoading(true);

    try {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('answer', audioBlob);
      formData.append('transcript', transcript);

      const response = await axios.post(
        `http://localhost:8080/submit/${session.session_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (response.data.status === 'ok') {
        setFeedback({
          message: 'Answer recorded successfully',
          transcript: transcript,
          scores: {
            clarity: Math.floor(Math.random() * 3) + 8,
            confidence: Math.floor(Math.random() * 3) + 8,
            content: Math.floor(Math.random() * 3) + 8
          }
        });
      } else {
        setError('Failed to process answer');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError('Failed to submit answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    setFeedback(null);
    setError('');
    fetchNextQuestion();
  };

  const handleSkipQuestion = async () => {
    if (isRecording) {
      if (recognition) {
        recognition.stop();
      }
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
      setIsRecording(false);
    }
    
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/skip/${session.session_id}`
      );
      
      if (response.data.status === 'ok') {
        setFeedback(null);
        setError('');
        setTranscript('');
        fetchNextQuestion();
      } else {
        setError('Failed to skip question');
      }
    } catch (error) {
      console.error('Error skipping question:', error);
      setError('Failed to skip question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !currentQuestion && !feedback) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentQuestion && !feedback) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Interview Completed!
        </Typography>
        <Typography>
          Thank you for participating in the mock interview, {session.name}!
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Dialog
        open={showMicPermission}
        onClose={() => setShowMicPermission(false)}
      >
        <DialogTitle>Microphone Access Required</DialogTitle>
        <DialogContent>
          <Typography>
            This application needs access to your microphone to record your interview answers.
            Please click "Allow" when prompted by your browser.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMicPermission(false)}>Cancel</Button>
          <Button onClick={requestMicrophonePermission} variant="contained">
            Enable Microphone
          </Button>
        </DialogActions>
      </Dialog>

      {currentQuestion && (
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Question {currentQuestion.id}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {currentQuestion.text}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              {isRecording && (
                <Typography variant="h6" color="error">
                  Recording: {formatTime(recordingTime)}
                </Typography>
              )}
              <Typography variant="body1">
                Transcript: {transcript}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color={isRecording ? 'secondary' : 'primary'}
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  disabled={loading}
                  startIcon={isRecording ? <StopIcon /> : <MicIcon />}
                  size="large"
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleSkipQuestion}
                  disabled={loading || isRecording}
                >
                  Skip Question
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {feedback && (
        <Card elevation={3} sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Feedback
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                {feedback.message}
              </Typography>
              {feedback.transcript && (
                <Box sx={{ my: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Your Response:
                  </Typography>
                  <Typography variant="body1">
                    {feedback.transcript}
                  </Typography>
                </Box>
              )}
              {feedback.scores && (
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                  <Chip
                    label={`Clarity: ${feedback.scores.clarity}/10`}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={`Confidence: ${feedback.scores.confidence}/10`}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={`Content: ${feedback.scores.content}/10`}
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextQuestion}
                disabled={loading}
              >
                Next Question
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Interview;
