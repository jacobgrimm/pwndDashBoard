// WhyPage.tsx
import { useState } from "react";
import "./WhyPage.css"; // Create this file

export default function WhyPage() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <div className="why-container">
      {/* Hero Section */}
      <header className="why-hero">
        <h1>
          <span role="img" aria-label="warning">
            ⚠️
          </span>{" "}
          Why This Exists
        </h1>
        <p className="hero-subtitle">
          A wake-up call for digital security in the age of data breaches
        </p>
      </header>

      {/* Problem Section */}
      <section className="content-section">
        <h2 className="section-title red-title">The Harsh Reality</h2>
        <div className="grid-layout">
          <img
            src="https://images.unsplash.com/photo-1556075798-4825dfaaf498"
            alt="Data breach"
            className="breach-image"
          />
          <div className="text-content">
            <p className="emphasis-text">
              💀 Every day, <strong>millions of compromised credentials</strong>
              circulate on hacking forums and dark web marketplaces.
            </p>
            <div className="warning-box">
              <div className="warning-header">
                <span role="img" aria-label="alert">
                  🚨
                </span>
                <h3>Our Controversial Approach</h3>
              </div>
              <p>
                We show actual leaked passwords because seeing is believing.
                These are already public - our goal is to shock users into
                action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Solutions */}
      <section className="solutions-section">
        <h2 className="section-title blue-title">Your Security Toolkit</h2>

        {/* MFA Accordion */}
        <div className="accordion">
          <button
            className="accordion-button"
            onClick={() => setOpenSection(openSection === "mfa" ? null : "mfa")}
            aria-expanded={openSection === "mfa"}
          >
            🔒 Multi-Factor Authentication (MFA)
            <span className="toggle-icon">
              {openSection === "mfa" ? "−" : "+"}
            </span>
          </button>
          {openSection === "mfa" && (
            <div className="accordion-content">
              <ul className="solution-list">
                <li>
                  ✅ <strong>What it is:</strong> Extra verification step beyond
                  passwords
                </li>
                <li>
                  ✅ <strong>Options:</strong> Authenticator apps, SMS codes,
                  hardware keys
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Password Tips Accordion */}
        <div className="accordion">
          <button
            className="accordion-button"
            onClick={() =>
              setOpenSection(openSection === "passwords" ? null : "passwords")
            }
            aria-expanded={openSection === "passwords"}
          >
            🔑 Password Best Practices
            <span className="toggle-icon">
              {openSection === "passwords" ? "−" : "+"}
            </span>
          </button>
          {openSection === "passwords" && (
            <div className="accordion-content">
              <div className="solution-list">
                <p>
                  ✅ Use a <strong>unique password</strong> for every account
                </p>
                <p>✅ Minimum 12 characters with mix of character types</p>
                <p>✅ Consider password managers (Bitwarden, 1Password)</p>
                <p>❌ Avoid personal information (birthdays, pet names)</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <div className="cta-section">
        <h3>Ready to Take Security Seriously?</h3>
        <button className="cta-button">Check Your Exposure Now →</button>
      </div>
    </div>
  );
}
