import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { sendContactMessage } from "../../services/api.js";
import "./Contact.css";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [status, setStatus] = useState({
    type: "",
    message: ""
  });

  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    setSending(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await sendContactMessage({
        name: form.name,
        email: form.email,
        message: form.subject
          ? `Subject: ${form.subject}\n\n${form.message}`
          : form.message
      });

      setStatus({
        type: "success",
        message: response.message
      });

      setForm({
        name: "",
        email: "",
        subject: "",
        message: ""
      });

    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message ||
          "Something went wrong. Please try again."
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="contact-page">

        <section className="contact-hero">
          <span>GET IN TOUCH</span>

          <h1>We'd Love to Hear From You</h1>

          <p>
            Have questions, suggestions or feedback about your
            travel planning experience? Send us a message.
          </p>
        </section>

        <section className="contact-container">

          <div className="contact-info">

            <div className="info-card">
              <div className="info-icon">✈️</div>
              <div>
                <h3>Plan Better</h3>
                <p>
                  Share your ideas and help us improve your
                  travel experience.
                </p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">💬</div>
              <div>
                <h3>Quick Support</h3>
                <p>
                  Send your questions and feedback directly
                  through the form.
                </p>
              </div>
            </div>

          </div>

          <div className="contact-form-card">

            <h2>Send us a message</h2>

            <form onSubmit={submit}>

              <div className="form-row">

                <div className="field">
                  <label>Your Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

              </div>

              <div className="field">
                <label>Subject</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What is your message about?"
                />
              </div>

              <div className="field">
                <label>Your Message</label>
                <textarea
                  name="message"
                  rows="7"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  required
                />
              </div>

              <button
                className="send-message-btn"
                disabled={sending}
              >
                {sending ? "Sending..." : "Send Message →"}
              </button>

            </form>

            {status.message && (
              <div className={`contact-status ${status.type}`}>
                {status.message}
              </div>
            )}

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}