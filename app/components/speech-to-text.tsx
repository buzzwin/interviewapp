// components/SpeechToText.tsx
import React, { useState, useEffect } from "react";

interface SpeechToTextProps {
  onTranscript: (transcript: string) => void;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    let recognition: SpeechRecognition | null = null;

    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        onTranscript(transcript);
      };
    }

    if (isListening && recognition) {
      recognition.start();
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening, onTranscript]);

  return (
    <button
      onClick={() => setIsListening(!isListening)}
      className={`px-4 py-2 rounded-md text-white font-semibold ${
        isListening
          ? "bg-red-500 hover:bg-red-600"
          : "bg-green-500 hover:bg-green-600"
      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
    >
      {isListening ? "Stop Listening" : "Start Listening"}
    </button>
  );
};

export default SpeechToText;
