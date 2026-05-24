export default function About() {
  return (
    <main style={{ minHeight: "100vh", fontFamily: "system-ui, sans-serif", background: "#f9fafb", padding: "3rem 2rem" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#111827", margin: "0 0 12px 0", letterSpacing: "-0.4px" }}>
          True Scoring Efficiency
        </h1>
        <p style={bodyText}>
          TSE (True Scoring Efficiency) is a metric that estimates how many possessions it takes a player to add points through their shooting. It measures points per possession (PPP), but does so with a formula that accounts for more than just points and true shot attempts.
        </p>

        <h2 style={sectionHeader}>What It Solves</h2>

        <div style={numberedItem}>
          <span style={number}>1.</span>
          <div>
            <p style={bodyText}><strong>The Free Throw Estimate</strong></p>
            <p style={{ ...bodyText, marginTop: "6px" }}>
              The most commonly cited advanced scoring efficiency statistic is true shooting (Formula found here:{" "}
              <a href="https://en.wikipedia.org/wiki/True_shooting_percentage" style={linkStyle} target="_blank" rel="noopener noreferrer">
                https://en.wikipedia.org/wiki/True_shooting_percentage
              </a>
              ). It does a great job of capturing the efficiency of a player's shot attempts, but still serves as an estimate rather than reality (TPE also has more granular minor estimates covered in the future extension section, but gets closer to reality). The culprit for this is the <strong>0.44 multiplier</strong> appended to free-throw attempts. It exists to account for the amount of possessions used on free throws, which eliminates technical free throws as well as and-1s. However, we have the actual play-by-play data available on these free throws, meaning we do not need this estimator.
            </p>
          </div>
        </div>

        <div style={numberedItem}>
          <span style={number}>2.</span>
          <div>
            <p style={bodyText}><strong>Scoring Turnovers</strong></p>
            <p style={{ ...bodyText, marginTop: "6px" }}>
              A missed shot is not the only way a player can use up a possession attempting to score. A turnover that occurs while trying to score also uses up a possession and is much worse in part because…
            </p>
          </div>
        </div>

        <div style={numberedItem}>
          <span style={number}>3.</span>
          <div>
            <p style={bodyText}><strong>Missed Shots Have Value</strong></p>
            <p style={{ ...bodyText, marginTop: "6px" }}>
              Not every missed shot actually uses a possession. A percentage of them become offensive rebounds, which gives the offense another (Often more efficient) chance to score.
            </p>
          </div>
        </div>

        <h2 style={sectionHeader}>The Formula</h2>
        <p style={bodyText}>
          I will not publish the exact formula right now (DM me{" "}
          <a href="https://twitter.com/hoopsdunker32" style={linkStyle} target="_blank" rel="noopener noreferrer">@hoopsdunker32</a>
          {" "}if you're curious), but the general calculations are important to know. The statistic uses two components, <strong>true points (TP)</strong> and <strong>true possessions used (TPU)</strong>, and then divides TP by TPU and multiples by 0.5 (Multiplies by 0.5 to match the true shooting scale).
        </p>
        <p style={{ ...bodyText, marginTop: "14px" }}>
          <strong>True Points:</strong> This statistic adds up your points scored and the expected second-chance points off of your missed shots. It does not include technical free throws.
        </p>
        <p style={{ ...bodyText, marginTop: "10px" }}>
          <strong>True Possessions Used:</strong> This statistic adds up your field goal attempts, possessions used on free throws, and scoring turnovers.
        </p>

        <h2 style={sectionHeader}>Future Extensions</h2>
        <p style={bodyText}>
          There are still levels of granularity yet to be captured. All missed shot attempts are currently treated equally, when in reality, different locations present diverse offensive rebounding rates and second chance PPP. The data needed to add this nuance exists and will be incorporated in the near future.
        </p>
        <p style={{ ...bodyText, marginTop: "14px" }}>
          A trickier dilemma is dealing with flagrant fouls, clear path fouls, and take fouls. Unlike technicals, there is no separate category for these fouls. When a player is shooting one of these fouls, it is because the player created the foul, giving their team free throws and possession. As such, these fouls should add to a player's true points but not to their true possessions used. As of now, they are treated like any foul. While relatively inconsequential to the final number, if I am marketing this stat as "true" scoring efficiency, I am looking to track empirical data, not just make an estimate.
        </p>
        <p style={{ ...bodyText, marginTop: "14px" }}>
          Scoring turnovers are also not perfect. The current methodology simply subtracts bad pass turnovers from the turnover count, but it must also be accounted for that not every player is dribbling the ball just to score. Of course, we'll never know a player's intentions when they commit a dribbling turnover, so this would have to be baked in as some sort of estimate.
        </p>
        <p style={{ ...bodyText, marginTop: "14px" }}>
          There are some other minor estimators at play as well, such as assuming all non-shooting fouls come with two free throws, which would take more granular play-by-play examination to parse out.
        </p>

      </div>
    </main>
  );
}

const bodyText: React.CSSProperties = {
  fontSize: "15px",
  color: "#374151",
  lineHeight: "1.75",
  margin: 0,
};

const sectionHeader: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 600,
  color: "#111827",
  margin: "2rem 0 1rem 0",
  letterSpacing: "-0.3px",
};

const numberedItem: React.CSSProperties = {
  display: "flex",
  gap: "14px",
  marginBottom: "1.25rem",
  alignItems: "flex-start",
};

const number: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: 600,
  color: "#111827",
  minWidth: "20px",
  paddingTop: "1px",
};

const linkStyle: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "none",
};