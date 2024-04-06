import React, { useState } from "react";
import Layout from "../components/layout/layout";
import "../styles/contact.css";
import emailjs from "emailjs-com";

const Contact = () => {
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");

  const sendEmail = () => {
    emailjs
      .send("service_yourServiceID", "template_yourTemplateID", {
        to_email: "arslanmazhar@gmail.com",
        from_email: senderEmail,
        message: message,
      })
      .then(function (response) {
        console.log("SUCCESS!", response.status, response.text);
        alert("Mail sent successfully!");
      })
      .catch(function (error) {
        console.error("FAILED...", error);
        alert("Failed to send mail!");
      });
  };

  return (
    <Layout>
      <section className="contact ">
        <div className="contact_container">
          <div className="content">
            <div className="left-side">
              <div className="address details">
                <i className="fas fa-map-marker-alt" />
                <div className="topic">Address</div>
                <div className="text-one">UNIVERSITY OF WAH</div>
                <div className="text-two">WAH CANTT</div>
              </div>
              <div className="phone details">
                <i className="fas fa-phone-alt" />
                <div className="topic">Phone</div>
                <div className="text-one">+0092 3135 065487</div>
              </div>
              <div className="email details">
                <i className="fas fa-envelope" />
                <div className="topic">Email</div>
                <div className="text-one">Sharjeel@gmail.com</div>
              </div>
            </div>
            <div className="right-side">
              <div className="topic-text">Send us a message</div>
              <p>
                If you have any work from us or any types of queries, you can
                send us a message from here. We will be pleased to help you.
              </p>
              <form>
                <div className="input-box">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                  />
                </div>
                <div className="input-box">
                  <input
                    type="text"
                    placeholder="Enter your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <div className="button">
                  <input type="button" value="Send Now" onClick={sendEmail} />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
