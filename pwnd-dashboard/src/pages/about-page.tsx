import "./AboutPage.css";

export default function AboutPage() {
  return (
    <div className="about-container">
      <header className="about-hero">
        <h1>Technical Architecture Overview</h1>
        <p className="hero-subtitle">
          A cloud-native credential monitoring system built on AWS serverless
          infrastructure
        </p>
      </header>

      <section className="tech-specs">
        <h2>Technical Specifications</h2>
        <div className="tech-badges">
          <span className="badge aws">AWS Lambda</span>
          <span className="badge aws">Amazon S3</span>
          <span className="badge aws">DynamoDB</span>
          <span className="badge aws">API Gateway</span>
          <span className="badge backend">Python FastAPI</span>
          <span className="badge infra">Docker</span>
          <span className="badge frontend">React</span>
          <span className="badge frontend">Vite</span>
          <span className="badge infra">CloudFront</span>
        </div>
      </section>

      <section className="architecture">
        <h2>System Architecture </h2>

        <div className="architecture-diagram">
          <div className="arch-step">
            <h3>1. Data Ingestion Pipeline</h3>
            <div className="arch-components">
              <div className="component">
                <h4>AWS Lambda (Cron)</h4>
                <ul>
                  <li>Weekly triggered scraping job</li>
                  <li>Monitors 15+ public combolist sources</li>
                  <li>Raw data stored in S3 bucket</li>
                </ul>
              </div>
              <div className="arrow">→</div>
              <div className="component">
                <h4>Processing Lambda</h4>
                <ul>
                  <li>S3 upload event-triggered</li>
                  <li>Data cleansing/normalization</li>
                  <li>Stores structured data in DynamoDB</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="arch-step">
            <h3>2. Query API Layer</h3>
            <div className="arch-components">
              <div className="component">
                <h4>API Gateway</h4>
                <ul>
                  <li>HTTPS REST API endpoint</li>
                  <li>Rate limiting & authentication</li>
                  <li>Integration with EC2 backend</li>
                </ul>
              </div>
              <div className="arrow">→</div>
              <div className="component">
                <h4>FastAPI Microservice</h4>
                <ul>
                  <li>Docker container on EC2</li>
                  <li>
                    Endpoints:
                    <ul>
                      <li>/search/email</li>
                      <li>/search/domain</li>
                      <li>/analytics</li>
                    </ul>
                  </li>
                  <li>Pagination support</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="arch-step">
            <h3>3. Frontend Delivery</h3>
            <div className="arch-components">
              <div className="component">
                <h4>React Application</h4>
                <ul>
                  <li>Vite build system</li>
                  <li>Chakra UI component library</li>
                  <li>API client with React Query</li>
                </ul>
              </div>
              <div className="arrow">→</div>
              <div className="component">
                <h4>AWS Hosting</h4>
                <ul>
                  <li>S3 static website hosting</li>
                  <li>CloudFront CDN distribution</li>
                  <li>Route53 DNS management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="key-features">
        <h2>Engineering Highlights</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Scalability</h3>
            <p>
              Serverless + Containerized architecture capable handling thousands
              of daily requests with automatic scaling
            </p>
          </div>
          <div className="feature-card">
            <h3>Security</h3>
            <p>
              IAM role-based access control, HTTPS encryption, and credential
              isolation
            </p>
          </div>
          <div className="feature-card">
            <h3>Observability</h3>
            <p>CloudWatch monitoring with custom metrics and X-Ray tracing</p>
          </div>
        </div>
      </section>
    </div>
  );
}
