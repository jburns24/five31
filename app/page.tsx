export default async function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-content">
          <h1 className="hero-headline">
            Built for lifters who want consistent, measurable strength gains
          </h1>
          <p className="hero-subheadline">
            Track your workouts using Jim Wendler's 5/3/1 program—a proven strength training
            methodology built on simple principles: start light, progress slowly, and build
            strength that lasts. No complicated spreadsheets, just lift and log.
          </p>
        </div>
      </section>

      {/* Program Overview Section */}
      <section className="program-overview">
        <div className="card">
          <h2>What is 5/3/1?</h2>
          <p>
            5/3/1 is a strength training program designed by powerlifter Jim Wendler.
            It focuses on four main barbell lifts—squat, bench press, deadlift, and
            overhead press—using a simple 4-week cycle that builds real, lasting strength.
          </p>

          <div className="philosophy-highlight">
            "Start too light, progress slowly"
          </div>

          <p>
            The core philosophy is sustainable progress. Instead of chasing quick gains that
            lead to burnout or injury, 5/3/1 uses submaximal training to ensure you're always
            making progress week after week, month after month.
          </p>

          {/* 4-Week Cycle Visual */}
          <div className="cycle-visual">
            <div className="cycle-week">
              <div className="cycle-week-label">Week 1</div>
              <div className="cycle-week-value">5s</div>
              <div className="cycle-week-desc">3×5 reps</div>
            </div>
            <div className="cycle-week">
              <div className="cycle-week-label">Week 2</div>
              <div className="cycle-week-value">3s</div>
              <div className="cycle-week-desc">3×3 reps</div>
            </div>
            <div className="cycle-week">
              <div className="cycle-week-label">Week 3</div>
              <div className="cycle-week-value">5/3/1</div>
              <div className="cycle-week-desc">5, 3, 1 reps</div>
            </div>
            <div className="cycle-week">
              <div className="cycle-week-label">Week 4</div>
              <div className="cycle-week-value">Deload</div>
              <div className="cycle-week-desc">Recovery</div>
            </div>
          </div>

          <ul className="program-benefits">
            <li>Simple progression that works for years, not just weeks</li>
            <li>Focus on the lifts that matter: squat, bench, deadlift, press</li>
            <li>Built-in deload weeks to prevent burnout and overtraining</li>
            <li>Flexible accessory work to address your weak points</li>
          </ul>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="landing-footer">
        <div className="footer-content">
          <p className="footer-attribution">
            This app follows{' '}
            <a
              href="https://www.jimwendler.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Jim Wendler's
            </a>{' '}
            5/3/1 methodology.
          </p>
          <p className="footer-disclaimer">
            This tool is not affiliated with Jim Wendler or his brand. It's an independent
            project built by a lifter who loves the program.
          </p>
          <div className="footer-links">
            <a
              href="https://www.jimwendler.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more about 5/3/1 →
            </a>
            <a
              href="https://buymeacoffee.com/joshuajohnn"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-coffee"
            >
              ☕ Buy Me a Coffee
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
