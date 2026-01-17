import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { TbMail } from "react-icons/tb";

const LandingPage = () => {
  useEffect(() => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const href = (e.currentTarget as HTMLAnchorElement).getAttribute(
          "href",
        );
        if (href && href.startsWith("#")) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
    });
    // Add scroll effect to header
    const header = document.querySelector(".header");
    const onScroll = () => {
      if (window.scrollY > 100) {
        if (header) {
          (header as HTMLElement).style.background =
            "rgba(255, 255, 255, 0.95)";
          (header as HTMLElement).style.backdropFilter = "blur(10px)";
        }
      } else {
        if (header) {
          (header as HTMLElement).style.background = "white";
          (header as HTMLElement).style.backdropFilter = "none";
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    // Animate elements on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };
    const observer = new window.IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = "1";
          (entry.target as HTMLElement).style.transform = "translateY(0)";
        }
      });
    }, observerOptions);
    document
      .querySelectorAll(".feature-card, .testimonial, .pricing-card")
      .forEach((el) => {
        (el as HTMLElement).style.opacity = "0";
        (el as HTMLElement).style.transform = "translateY(30px)";
        (el as HTMLElement).style.transition =
          "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(el);
      });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="container">
          <nav className="nav">
            <a href="#" className="logo">
              AIMANTIS
            </a>
            <ul className="nav-links">
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#pricing">Pricing</a>
              </li>
              <li>
                <a href="#testimonials">Reviews</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
              <li>
                <Link to={ROUTES.LOGIN} className="btn auth-btn btn-outline">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to={ROUTES.SIGNUP} className="btn auth-btn btn-primary">
                  Start Free Trial
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="fade-in-up">Modern Property Management Made Simple</h1>
          <p className="fade-in-up">
            Streamline your rental business with AIMANTIS. Manage bookings,
            guests, payments, and maintenance all in one powerful platform
            trusted by property managers worldwide.
          </p>
          <div className="hero-cta fade-in-up">
            <Link to={ROUTES.SIGNUP} className="btn btn-primary btn-large">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Start Free 14-Day Trial
            </Link>
            <a href="#demo" className="btn btn-outline btn-large">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Watch Demo
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">20+</span>
              <span className="stat-label">Properties Managed</span>
            </div>
            <div className="stat">
              <span className="stat-number">1,000+</span>
              <span className="stat-label">Bookings Processed</span>
            </div>
            <div className="stat">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Uptime Guarantee</span>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Everything You Need to Manage Properties
            </h2>
            <p className="section-subtitle">
              From booking management to financial reporting, AIMANTIS provides
              all the tools you need to run a successful rental business.
            </p>
          </div>
          <div className="features-grid">
            {/* Feature Cards */}
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="feature-title">Smart Booking Management</h3>
              <p className="feature-description">
                Automate reservations, manage availability, and sync with major
                booking platforms. Handle check-ins, check-outs guest
                communications and bureacracy management effortlessly.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="feature-title">Guest Experience Hub</h3>
              <p className="feature-description">
                Centralize guest profiles, communication history, and
                preferences. Send automated messages and provide exceptional
                service that keeps guests coming back.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h3 className="feature-title">Financial Management</h3>
              <p className="feature-description">
                Track payments, generate invoices, and manage expenses. Get
                detailed financial reports and insights to optimize your revenue
                and profitability.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="feature-title">Property Portfolio</h3>
              <p className="feature-description">
                Manage multiple properties from a single dashboard. Track
                performance, maintenance schedules, and occupancy rates across
                your entire portfolio.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"
                  />
                </svg>
              </div>
              <h3 className="feature-title">Analytics & Reporting</h3>
              <p className="feature-description">
                Make data-driven decisions with comprehensive analytics. Track
                occupancy rates, revenue trends, and guest satisfaction metrics.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="feature-title">Mobile Management</h3>
              <p className="feature-description">
                Manage your properties on the go with our mobile-optimized
                platform. Handle urgent requests and stay connected with your
                business anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Dashboard Preview */}
      <section className="dashboard-preview" id="demo">
        <div className="container">
          <div className="preview-container">
            <div className="preview-content">
              <h2>See AIMANTIS in Action</h2>
              <p>
                Our intuitive dashboard gives you complete control over your
                property management operations. Everything you need is just a
                click away.
              </p>
              <ul className="preview-features">
                <li>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Real-time booking calendar
                </li>
                <li>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Automated guest communication
                </li>
                <li>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Financial tracking & reporting
                </li>
                <li>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Maintenance management
                </li>
              </ul>
              <Link to={ROUTES.SIGNUP} className="btn btn-primary btn-large">
                Start Your Free Trial
              </Link>
            </div>
            <div className="dashboard-mockup">
              <div className="mockup-header">
                <div className="mockup-dot dot-red"></div>
                <div className="mockup-dot dot-yellow"></div>
                <div className="mockup-dot dot-green"></div>
              </div>
              <div className="mockup-content">
                <div className="mockup-nav">
                  <div className="mockup-tab active">Dashboard</div>
                  <div className="mockup-tab">Bookings</div>
                  <div className="mockup-tab">Guests</div>
                  <div className="mockup-tab">Properties</div>
                </div>
                <div className="mockup-stats">
                  <div className="mockup-stat">
                    <div className="mockup-stat-number">24</div>
                    <div className="mockup-stat-label">Active Bookings</div>
                  </div>
                  <div className="mockup-stat">
                    <div className="mockup-stat-number">24,450€</div>
                    <div className="mockup-stat-label">Monthly Revenue</div>
                  </div>
                  <div className="mockup-stat">
                    <div className="mockup-stat-number">89%</div>
                    <div className="mockup-stat-label">Occupancy Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Trusted by Property Managers Worldwide
            </h2>
            <p className="section-subtitle">
              See what our customers have to say about their experience with
              AIMANTIS.
            </p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial">
              <div className="testimonial-content">
                "AIMANTIS has completely transformed how we manage our 50+
                properties. The automation features alone have saved us 20 hours
                per week, and our guest satisfaction scores have never been
                higher."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">SM</div>
                <div className="author-info">
                  <h4>Sarah Mitchell</h4>
                  <p>Property Manager, Coastal Rentals</p>
                </div>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial-content">
                "The financial reporting features are incredible. We can now
                track our ROI across all properties in real-time and make
                data-driven decisions that have increased our revenue by 35%."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">MJ</div>
                <div className="author-info">
                  <h4>Michael Johnson</h4>
                  <p>CEO, Urban Properties Group</p>
                </div>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial-content">
                "As a small property owner, I was worried about complex
                software. AIMANTIS is so intuitive that I was up and running in
                minutes. It's like having a property management team in my
                pocket."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">ER</div>
                <div className="author-info">
                  <h4>Emily Rodriguez</h4>
                  <p>Independent Property Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Pricing */}
      <section className="pricing" id="pricing">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="section-subtitle">
              Choose the plan that fits your business. All plans include a
              14-day free trial with no credit card required.
            </p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-plan">Starter</div>
              <div className="pricing-price">79€</div>
              <div className="pricing-period">per month</div>
              <ul className="pricing-features">
                <li>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Up to 5 properties
                </li>
                <li>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Unlimited bookings
                </li>
                <li>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Basic reporting
                </li>
                <li>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Email support
                </li>
              </ul>
              <Link to={ROUTES.SIGNUP} className="btn btn-outline btn-large">
                Start Free Trial
              </Link>
            </div>
            <div className="pricing-card featured">
              <div className="pricing-badge">Most Popular</div>
              <div className="pricing-plan">Professional</div>
              <div className="pricing-price">249€</div>
              <div className="pricing-period">per month</div>
              <ul className="pricing-features">
                <li>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Up to 25 properties
                </li>
                <li>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Advanced automation
                </li>
                <li>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Financial reporting
                </li>
                <li>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Priority support
                </li>
                <li>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  API access
                </li>
              </ul>
              <Link to={ROUTES.SIGNUP} className="btn btn-primary btn-large">
                Start Free Trial
              </Link>
            </div>
            <div className="pricing-card">
              <div className="pricing-plan">Enterprise</div>
              <div className="pricing-price">1,000€</div>
              <div className="pricing-period">per month</div>
              <ul className="pricing-features">
                <li>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Unlimited properties
                </li>
                <li>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  White-label solution
                </li>
                <li>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Custom integrations
                </li>
                <li>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Dedicated support
                </li>
                <li>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Training & onboarding
                </li>
              </ul>
              <Link to="#contact" className="btn btn-outline btn-large">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Transform Your Property Management?</h2>
          <p>
            Join thousands of property managers who trust AIMANTIS to grow their
            business.
          </p>
          <Link to={ROUTES.SIGNUP} className="btn btn-primary btn-large">
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Start Your Free 14-Day Trial
          </Link>
        </div>
      </section>
      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>AIMANTIS</h3>
              <p style={{ color: "#9ca3af", marginBottom: "1rem" }}>
                Modern property management software that helps you grow your
                rental business with confidence.
              </p>
              <p className="flex items-center gap-3" style={{ color: "#9ca3af" }}>
                <TbMail size={18}/>
                <a href="mailto:info@aimantis.com">info@aimantis.com</a>
              </p>
              <p style={{ color: "#9ca3af" }}>📞 +34 616 67 12 66</p>
            </div>
            <div className="footer-section">
              <h3>Product</h3>
              <ul>
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#pricing">Pricing</a>
                </li>
                <li>
                  <a href="#">Integrations</a>
                </li>
                <li>
                  <a href="#">API Documentation</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Company</h3>
              <ul>
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
                <li>
                  <a href="#">Press</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Support</h3>
              <ul>
                <li>
                  <a href="#">Help Center</a>
                </li>
                <li>
                  <a href="#">Community</a>
                </li>
                <li>
                  <a href="#">Status</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 AIMANTIS. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {/* Styles */}
      <style>{`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #111827;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        }
        .h2{
            color: #ebf0fa !important;
        }
        /* Header */
        .header {
            background: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
        }

        .nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 0;
        }

        .logo {
            font-size: 1.75rem;
            font-weight: bold;
            color: #1e3a8a;
            text-decoration: none;
        }

        .nav-links {
            display: flex;
            list-style: none;
            gap: 2rem;
            align-items: center;
        }

        .nav-links a {
            text-decoration: none;
            color: #white;
            font-weight: 500;
            transition: color 0.2s;
        }

        .nav-links a:hover {
            color: #2563eb;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
        }

        .btn-primary {
            background: #2563eb;
            color: white;
        }

        .btn-primary:hover {
            background: #1d4ed8;
            transform: translateY(-1px);
            color:white;
        }

        .btn-outline {
            background: white;
            color: #2563eb;
            border: 2px solid #2563eb;
            
            }
            
            .btn-outline:hover {
              background: #2563eb;
              color: white;
        }

        .btn-large {
            padding: 1rem 2rem;
            font-size: 1rem;
        }
            .auth-btn:hover{
            color : white !important
            }


        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            color: white;
            padding: 8rem 0 6rem;
            margin-top: 80px;
            text-align: center;
        }

        .hero h1 {
            font-size: 3.5rem;
            font-weight: 800;
            margin-bottom: 1.5rem;
            line-height: 1.1;
        }

        .hero p {
            font-size: 1.25rem;
            margin-bottom: 2.5rem;
            opacity: 0.9;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        .hero-cta {
            display: flex;
            gap: 1rem;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
        }

        .hero-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            margin-top: 4rem;
            padding-top: 3rem;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat {
            text-align: center;
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
            display: block;
        }

        .stat-label {
            font-size: 0.875rem;
            opacity: 0.8;
        }

        /* Features Section */
        .features {
            padding: 6rem 0;
            background: #f9fafb;
        }

        .section-header {
            text-align: center;
            margin-bottom: 4rem;
        }

        .section-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #111827;
        }

        .section-subtitle {
            font-size: 1.125rem;
            color: #6b7280;
            max-width: 600px;
            margin: 0 auto;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }

        .feature-card {
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .feature-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
            width: 48px;
            height: 48px;
            background: #dbeafe;
            border-radius: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.5rem;
        }

        .feature-icon svg {
            width: 24px;
            height: 24px;
            color: #2563eb;
        }

        .feature-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
            color: #111827;
        }

        .feature-description {
            color: #6b7280;
            line-height: 1.6;
        }

        /* Dashboard Preview */
        .dashboard-preview {
            padding: 6rem 0;
            background: white;
        }

        .preview-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
        }

        .preview-content h2 {
            font-size: 2.25rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            color: #111827;
        }

        .preview-content p {
            font-size: 1.125rem;
            color: #6b7280;
            margin-bottom: 2rem;
        }

        .preview-features {
            list-style: none;
            margin-bottom: 2rem;
        }

        .preview-features li {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
            color: #374151;
        }

        .preview-features svg {
            width: 20px;
            height: 20px;
            color: #10b981;
        }

        .dashboard-mockup {
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            border-radius: 1rem;
            padding: 2rem;
            border: 1px solid #d1d5db;
            position: relative;
            overflow: hidden;
        }

        .mockup-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
        }

        .mockup-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }

        .dot-red { background: #ef4444; }
        .dot-yellow { background: #f59e0b; }
        .dot-green { background: #10b981; }

        .mockup-content {
            background: white;
            border-radius: 0.5rem;
            padding: 1.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .mockup-nav {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #e5e7eb;
        }

        .mockup-tab {
            padding: 0.5rem 1rem;
            background: #f3f4f6;
            border-radius: 0.25rem;
            font-size: 0.875rem;
            color: #6b7280;
        }

        .mockup-tab.active {
            background: #2563eb;
            color: white;
        }

        .mockup-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
        }

        .mockup-stat {
            text-align: center;
            padding: 1rem;
            background: #f8fafc;
            border-radius: 0.5rem;
        }

        .mockup-stat-number {
            font-size: 1.5rem;
            font-weight: bold;
            color: #2563eb;
        }

        .mockup-stat-label {
            font-size: 0.75rem;
            color: #6b7280;
        }

        /* Testimonials */
        .testimonials {
            padding: 6rem 0;
            background: #f9fafb;
        }

        .testimonials-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
        }

        .testimonial {
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
        }

        .testimonial-content {
            font-style: italic;
            color: #374151;
            margin-bottom: 1.5rem;
            font-size: 1.125rem;
            line-height: 1.6;
        }

        .testimonial-author {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .author-avatar {
            width: 48px;
            height: 48px;
            background: #2563eb;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
        }

        .author-info h4 {
            font-weight: 600;
            color: #111827;
        }

        .author-info p {
            font-size: 0.875rem;
            color: #6b7280;
        }

        /* Pricing */
        .pricing {
            padding: 6rem 0;
            background: white;
        }

        .pricing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .pricing-card {
            background: white;
            border: 2px solid #e5e7eb;
            border-radius: 1rem;
            padding: 2rem;
            text-align: center;
            position: relative;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .pricing-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .pricing-card.featured {
            border-color: #2563eb;
            transform: scale(1.05);
        }

        .pricing-badge {
            position: absolute;
            top: -12px;
            left: 50%;
            transform: translateX(-50%);
            background: #2563eb;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 600;
        }

        .pricing-plan {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #111827;
        }

        .pricing-price {
            font-size: 3rem;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 0.5rem;
        }

        .pricing-period {
            color: #6b7280;
            margin-bottom: 2rem;
        }

        .pricing-features {
            list-style: none;
            margin-bottom: 2rem;
            text-align: left;
        }

        .pricing-features li {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
            color: #374151;
        }

        .pricing-features svg {
            width: 16px;
            height: 16px;
            color: #10b981;
        }

        /* CTA Section */
        .cta {
            padding: 6rem 0;
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            color: white;
            text-align: center;
        }

        .cta h2 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #ebf0fa !important;
        }

        .cta p {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }

        /* Footer */
        .footer {
            background: #111827;
            color: white;
            padding: 3rem 0 1rem;
        }

        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .footer-section h3 {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }

        .footer-section ul {
            list-style: none;
        }

        .footer-section ul li {
            margin-bottom: 0.5rem;
        }

        .footer-section ul li a {
            color: #9ca3af;
            text-decoration: none;
            transition: color 0.2s;
        }

        .footer-section ul li a:hover {
            color: white;
        }

        .footer-bottom {
            border-top: 1px solid #374151;
            padding-top: 1rem;
            text-align: center;
            color: #9ca3af;
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }

            .hero h1 {
                font-size: 2.5rem;
            }

            .hero-stats {
                grid-template-columns: 1fr;
                gap: 1rem;
            }

            .preview-container {
                grid-template-columns: 1fr;
                gap: 2rem;
            }

            .mockup-stats {
                grid-template-columns: 1fr;
            }

            .hero-cta {
                flex-direction: column;
            }

            .pricing-card.featured {
                transform: none;
            }
        }

        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .fade-in-up {
            animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </>
  );
};

export default LandingPage;
