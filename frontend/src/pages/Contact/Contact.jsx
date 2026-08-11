import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import "./Contact.css";

function Contact() {
  return (
    <>
      <Navbar />

      <main className="contact-page">
        <div className="contact-box">

          <h1>Contact Us</h1>

          <p>
            Have a question or suggestion? We would love to hear from you.
          </p>

          <form onSubmit={(event) => event.preventDefault()}>

            <input
              type="text"
              placeholder="Your Name"
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              required
            />

            <textarea
              rows="6"
              placeholder="Your Message"
              required
            ></textarea>

            <button type="submit">
              Send Message
            </button>

          </form>

          <p className="contact-email">
            Or email us directly:
            <a href="mailto:priya@gmail.com">
              hasiniambati200@gmail.com
            </a>
          </p>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default Contact;
