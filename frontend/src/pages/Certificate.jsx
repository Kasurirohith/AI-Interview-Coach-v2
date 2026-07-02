import "./Certificate.css";

function Certificate() {
  const username = localStorage.getItem("username") || "Guest";
  const atsScore = localStorage.getItem("atsScore") || 0;

  const issueDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="certificate-page">
      <div className="certificate" id="certificate">

        <div className="certificate-border">

          <h3 className="title">
            🏆 CERTIFICATE OF ACHIEVEMENT
          </h3>

          <p className="subtitle">
            This Certificate is Proudly Presented To
          </p>

          <h1 className="name">
            {username.toUpperCase()}
          </h1>

          <p className="description">
            For successfully completing the
            <br />
            <b>AI Mock Interview</b>
          </p>

          <h4 className="score-title">
            ATS SCORE
          </h4>

          <h2 className="score">
            {atsScore}%
          </h2>

          <p className="platform">
            AI Interview Coach Platform
          </p>

          <div className="footer">

            <div>
              <div className="line"></div>
              <p>Authorized Signature</p>
            </div>

            <div>
              <p>
                <b>Issue Date</b>
              </p>
              <p>{issueDate}</p>
            </div>

          </div>

        </div>
      </div>

      <button
        className="download-btn"
        onClick={() => window.print()}
      >
        Download Certificate
      </button>

    </div>
  );
}

export default Certificate;
