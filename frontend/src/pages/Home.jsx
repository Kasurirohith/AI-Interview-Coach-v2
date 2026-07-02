import { useState, useEffect } from "react";
import { uploadResume, saveInterviewResult } from "../services/api";
import Stats from "../components/Stats";
import Companies from "../components/Companies";
import DailyChallenge from "../components/DailyChallenge";

function Home() {
  // 1. Initial State Hooks Block
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [atsScore, setAtsScore] = useState(0);
  const [skills, setSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  // Challenges Object Metadata Array List Layout
  const externalChallengesList = [
    {
      title: "Solve Two Sum (Arrays)",
      url: "https://leetcode.com/problems/two-sum/",
    },
    {
      title: "Write an SQL INNER JOIN query",
      url: "https://leetcode.com/problemset/database/",
    },
    {
      title: "Answer: Tell me about yourself",
      url: "https://leetcode.com/problemset/all/",
    },
    {
      title: "Revise OOP Concepts",
      url: "https://leetcode.com/tag/object-oriented-design/",
    },
  ];

  // 2. Computed Values Block
  const username = localStorage.getItem("username") || "Guest";
  const uploaded = atsScore > 0;

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const [recognition] = useState(() => {
    if (!SpeechRecognition) return null;

    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.lang = "en-US";

    return recog;
  });

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event) => {
      setAnswer(event.results[0][0].transcript);
    };
  }, [recognition]);

  // FIX: Real backend call triggered via dedicated button
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume first");
      return;
    }

    try {
      const result = await uploadResume(file);

      // Save real response features to State
      setResumeText(result.resume_text);
      setAtsScore(result.ats_score);
      setSkills(result.skills || []);
      setMissingSkills(result.missing_skills || []);
      setQuestions(result.questions || []);

      // Mirror to storage for persistent dashboard visibility
      localStorage.setItem("resumeName", file.name);
      localStorage.setItem("atsScore", result.ats_score);
      localStorage.setItem("resumeStatus", "Uploaded Successfully");

      alert("Resume Uploaded and Analyzed Successfully!");
    } catch (error) {
      console.error(error);
      alert("Upload Failed! Make sure your Render backend is up and running.");
    }
  };

  // AI Speaking Feature
  const speakQuestion = (text) => {
    window.speechSynthesis.cancel();

    const speech = new window.SpeechSynthesisUtterance(text);

    speech.lang = "en-US";
    speech.rate = 0.95;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  const startInterview = async () => {
    const targetQuestions = questions.length > 0 ? questions : [
      "Tell me about yourself and your technical background.",
      "What are your key professional strengths and core skills?",
      "Can you describe a challenging project you successfully resolved?"
    ];

    if (targetQuestions.length === 0 && !uploaded) {
      alert("Upload Resume First!");
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (questions.length === 0) {
        setQuestions(targetQuestions);
      }

      setInterviewStarted(true);

      setTimeout(() => {
        speakQuestion(targetQuestions[0]);
      }, 500);
    } catch (error) {
      alert("Camera or Microphone permission denied!");
      console.error(error);
    }
  };

  const nextQuestion = async () => {
    if (answer.trim() !== "") {
      setScore((prev) => prev + 10);
    }

    setTimeLeft(60);
    setAnswer("");

    if (currentQuestion < questions.length - 1) {
      const next = currentQuestion + 1;
      setCurrentQuestion(next);

      setTimeout(() => {
        speakQuestion(questions[next]);
      }, 300);
    } else {
      window.speechSynthesis.cancel();

      const finalScore = score + 10;
      const email = localStorage.getItem("email");

      try {
        const response = await saveInterviewResult(
          email,
          atsScore,
          finalScore
        );
        console.log("Save Result:", response);
      } catch (error) {
        console.log(error);
      }

      localStorage.setItem("interviewScore", finalScore);
      localStorage.setItem("atsScore", atsScore);
      window.location.href = "/report";

      setInterviewStarted(false);
      setCurrentQuestion(0);
      setScore(0);
    }
  };

  // Timer Effect
  useEffect(() => {
    if (!interviewStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          nextQuestion();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [interviewStarted, currentQuestion, questions, score, atsScore]);

  if (interviewStarted) {
    return (
      <div className="home">
        <h1>Mock Interview</h1>

        <div
          style={{
            maxWidth: "900px",
            width: "100%",
            margin: "auto",
            background: "#111827",
            padding: "30px",
            borderRadius: "10px",
            color: "white",
          }}
        >
          <h2>
            Question {currentQuestion + 1} of {questions.length}
          </h2>

          <h3
            style={{
              color: "#60a5fa",
              marginTop: "10px",
            }}
          >
            ⏱️ Time Left: {timeLeft}s
          </h3>

          <div
            style={{
              width: "100%",
              height: "12px",
              background: "#374151",
              borderRadius: "10px",
              marginTop: "15px",
            }}
          >
            <div
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                height: "100%",
                background: "#3b82f6",
                borderRadius: "10px",
              }}
            />
          </div>

          <h3 style={{ marginTop: "20px" }}>{questions[currentQuestion]}</h3>

          <button
            className="secondary-btn"
            onClick={() => speakQuestion(questions[currentQuestion])}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              fontSize: "16px",
              marginRight: "10px",
            }}
          >
            🔊 Repeat Question
          </button>

          <button
            className="secondary-btn"
            onClick={() => recognition && recognition.start()}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              fontSize: "16px",
            }}
          >
            🎤 Speak Answer
          </button>

          <textarea
            rows="8"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "10px",
            }}
          />

          <button
            className="primary-btn"
            onClick={nextQuestion}
            style={{ marginTop: "20px" }}
          >
            Next Question
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home">

      <p>
        Prepare smarter with AI-powered mock interviews, personalized feedback,
        resume-based questions, and detailed performance reports.
      </p>
      
      {/* ================= Welcome Dashboard ================= */}
      <div className="welcome-dashboard">
        <h2>Hello! Welcome {username}</h2>
        <p>
          Upload your resume and begin your personalized interview.
        </p>

        <div className="resume-status">
          <div className="status-card">
            <h3>{uploaded ? " Uploaded" : "Resume Not Uploaded"}</h3>
            <p>Resume Status</p>
          </div>

          <div className="status-card">
            <h3>{uploaded ? `${atsScore}%` : "--"}</h3>
            <p>ATS Score</p>
          </div>

          <div className="status-card">
            <h3>{questions.length > 0 ? questions.length : 0}</h3>
            <p>Questions Generated</p>
          </div>

          <div className="status-card">
            <h3>Beginner</h3>
            <p>Level</p>
          </div>
        </div>

        {/* FIX 2: File selector now only handles selecting/staging the item */}
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
              setFile(selectedFile);
            }
          }}
        />

        <div className="buttons" style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" }}>
          {/* FIX 2 (Continued): Added explicit call button to trigger network payload handling */}
          <button
            className="primary-btn"
            onClick={handleUpload}
            disabled={!file}
            style={{ width: "100%" }}
          >
             Upload Resume
          </button>

          <button
            className="secondary-btn"
            onClick={startInterview}
            disabled={!uploaded}
            style={{ width: "100%" }}
          >
            Start Interview
          </button>
        </div>
      </div>

      <DailyChallenge customChallenges={externalChallengesList} />
      <Stats />
      <Companies />

      {atsScore > 0 && (
        <div className="resume-card">
          <h2>ATS Score</h2>
          <h1>{atsScore}/100</h1>

          <h3>Skills Found</h3>
          <ul>
            {skills.length > 0 ? skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            )) : (
              <li>No unique skills extracted.</li>
            )}
          </ul>

          <h3>Missing Skills</h3>
          <ul>
            {missingSkills.length > 0 ? missingSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            )) : (
              <li>Great setup! No missing skills noted.</li>
            )}
          </ul>

          <h3>Resume Text</h3>
          <textarea
            value={resumeText || ""}
            readOnly
            rows="10"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "10px",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Home;
