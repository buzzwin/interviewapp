// components/InterviewQuestions.tsx
"use client";

// components/InterviewQuestions.tsx
import React, { useState } from "react";
import axios from "axios";
import TextToSpeech from "../components/text-to-speech";
import SpeechToText from "../components/speech-to-text";

const InterviewQuestions: React.FC = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/generate-questions", {
        jobDescription,
      });
      setQuestions(response.data.questions);
      setCurrentQuestionIndex(0);
      setAnswer("");
      setFeedback("");
    } catch (err) {
      setError("Failed to generate questions. Please try again.");
      console.error(err);
    }

    setIsLoading(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer("");
      setFeedback("");
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setAnswer("");
      setFeedback("");
    }
  };

  const handleEvaluate = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/evaluate-response", {
        question: questions[currentQuestionIndex],
        answer,
      });
      setFeedback(response.data.feedback);
    } catch (err) {
      setError("Failed to evaluate response. Please try again.");
      console.error(err);
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-md">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
        Interview Question Generator
      </h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Enter job description here"
          rows={5}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
        >
          {isLoading ? "Generating..." : "Generate Questions"}
        </button>
      </form>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      {questions.length > 0 && (
        <div className="p-6 rounded-md bg-gray-50">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <p className="mb-4 text-lg">{questions[currentQuestionIndex]}</p>
          <div className="mb-4">
            <TextToSpeech text={questions[currentQuestionIndex]} />
          </div>
          <div className="mb-4">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here"
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <SpeechToText onTranscript={setAnswer} />
          </div>
          <div className="mb-4">
            <button
              onClick={handleEvaluate}
              disabled={isLoading || !answer}
              className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
                isLoading || !answer
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              }`}
            >
              {isLoading ? "Evaluating..." : "Evaluate Response"}
            </button>
          </div>
          {feedback && (
            <div className="p-4 mb-4 border border-blue-200 rounded-md bg-blue-50">
              <h3 className="mb-2 text-lg font-semibold">Feedback:</h3>
              <p className="whitespace-pre-wrap">{feedback}</p>
            </div>
          )}
          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewQuestions;
