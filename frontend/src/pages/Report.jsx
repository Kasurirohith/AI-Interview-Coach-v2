import { Link } from "react-router-dom";

function Report() {
  const username = localStorage.getItem("username") || "Guest";
  const atsScore = localStorage.getItem("atsScore") || 0;
  const interviewScore = localStorage.getItem("interviewScore") || 0;

  const strengths = [
    "Java Programming",
    "Problem Solving",
    "Communication",
  ];

  const improvements = [
    "SQL",
    "System Design",
    "Confidence",
  ];

  const recommendations = [
    "Practice Arrays",
    "Revise OOP",
    "Solve 2 SQL Problems Daily",
    "Take 3 Mock Interviews Weekly",
  ];

  // Logic to determine performance label based on score
  const getPerformanceLabel = (score) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Average";
    return "Needs Work";
  };

  return (
    <div
      style={{
        width: "95%",
        maxWidth: "1200px",
        margin: "40px auto",
      }}
    >
      {/* CSS Print Styles to optimize printed/saved layout */}
      <style>
        {`
          @media print {
            @page {
              size: auto;
              margin: 20mm; /* Clean padding for standard report printing */
            }
            
            body {
              background: #fff !important;
              color: #000 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            /* Hide all navigation buttons from the final print out */
            .action-buttons {
              display: none !important;
            }

            /* Prevent elements from awkwardly splitting mid-sentence across pages */
            .stat-card, ul, h2 {
              page-break-inside: avoid !important;
            }
          }
        `}
      </style>

      <h1
        style={{
          textAlign: "center",
          fontSize: "50px",
          marginBottom: "40px",
        }}
      >
        📄 AI Interview Report
      </h1>

      <div className="stats">
        <div className="stat-card">
          <h2>{atsScore}%</h2>
          <p>ATS Score</p>
        </div>

        <div className="stat-card">
          <h2>{interviewScore}%</h2>
          <p>Interview Score</p>
        </div>

        <div className="stat-card">
          <h2>Gold</h2>
          <p>Level</p>
        </div>

        <div className="stat-card">
          {/* Dynamically inserted performance metric based on interview score */}
          <h2>{getPerformanceLabel(Number(interviewScore))}</h2>
          <p>Performance</p>
        </div>
      </div>

      <div
        className="resume-card"
        style={{
          marginTop: "40px",
        }}
      >
        <h2>👤 Candidate</h2>
        <p>{username}</p>

        <hr />

        <h2>Strengths</h2>
        <ul>
          {strengths.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <hr />

        <h2>⚠ Needs Improvement</h2>
        <ul>
          {improvements.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <hr />

        <h2>Recommended Topics</h2>
        <ul>
          {recommendations.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <hr />

        <h2>Overall Feedback</h2>
        <p>
          Good interview performance. Continue practicing coding, communication
          and system design to improve your placement chances.
        </p>

        {/* Grouped buttons in an action-buttons class to easily strip them away on print */}
        <div
          className="action-buttons"
          style={{
            marginTop: "35px",
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <button className="primary-btn" onClick={() => window.print()}>
            Download Report
          </button>

          <Link to="/certificate">
            <button className="primary-btn">🏆 View Certificate</button>
          </Link>

          <Link to="/dashboard">
            <button className="secondary-btn">Dashboard</button>
          </Link>

          <Link to="/">
            <button className="secondary-btn">Home</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Report;
