import React from "react";

function Certificate() {
  const username = localStorage.getItem("username") || "Guest";
  const atsScore = localStorage.getItem("atsScore") || 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      {/* Injecting Print Styles to force single page layout */}
      <style>
        {`
          @media print {
            /* Remove standard browser headers, footers, and margins */
            @page {
              size: auto;
              margin: 0;
            }
            
            /* Reset body styles for clean printing */
            body {
              background: #000 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              margin: 0;
              padding: 0;
            }

            /* Ensure wrapper takes exactly full viewport and avoids page break */
            .cert-wrapper {
              height: 100vh !important;
              min-height: 100vh !important;
              padding: 0 !important;
              box-sizing: border-box !important;
              page-break-inside: avoid !important;
            }

            /* Keep the card dimensions intact but remove heavy shadow filters */
            .cert-card {
              box-shadow: none !important;
              border: 1px solid #ddd !important;
              page-break-inside: avoid !important;
            }

            /* Hide action buttons during print */
            .print-btn {
              display: none !important;
            }
          }
        `}
      </style>

      <div
        className="cert-wrapper"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="cert-card"
          style={{
            width: "900px",
            background: "#fff",
            borderRadius: "20px",
            padding: "60px",
            textAlign: "center",
            color: "#000",
            boxShadow: "0 20px 40px rgba(0,0,0,.5)",
          }}
        >
          <h4 style={{ margin: 0, letterSpacing: "1px" }}>
            🏆 CERTIFICATE OF ACHIEVEMENT
          </h4>

          <h1 style={{ marginTop: 30, fontSize: "40px" }}>{username}</h1>

          <p style={{ marginTop: 25, fontSize: "20px", color: "#4b5563" }}>
            Successfully completed the AI Mock Interview and achieved an ATS
            Score of
          </p>

          <h2
            style={{
              color: "#2563eb",
              fontSize: "60px",
              margin: "30px 0",
              fontWeight: "bold",
            }}
          >
            {atsScore}%
          </h2>

          <p style={{ margin: 0, fontStyle: "italic", color: "#6b7280" }}>
            AI Interview Coach Platform
          </p>

          <button
            className="print-btn"
            style={{
              marginTop: 40,
              padding: "12px 35px",
              border: "none",
              borderRadius: "10px",
              background: "#2563eb",
              color: "#fff",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}
            onClick={() => window.print()}
          >
            Download Certificate
          </button>
        </div>
      </div>
    </div>
  );
}

export default Certificate;
