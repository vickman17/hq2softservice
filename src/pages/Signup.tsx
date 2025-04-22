import { IonPage, IonToast} from "@ionic/react";
import React, { useState, useEffect } from "react";
import styles from "./style/Signup.module.css";
import {useHistory} from  "react-router";

const Signup: React.FC = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    signupEmail: "",
    phone: "",
    signupPassword: "",
    role: "clients"
  });


  const history = useHistory();

  // State to track submission status or errors
  const [text, setText] = useState("");
  const [toast, setToast] = useState<boolean>(false)
  const [statusColor, setStatusColor] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  
  // State to manage form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsSubmitting(true); // Disable button when form is being submitted

    try {
      const response = await fetch("http://localhost/hq2ClientApi/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log(formData);
      const data = await response.json(); // Always parse the JSON response

      if (data.success) {
        setStatusColor("success");
        setText("Registration successful, We sent you an OTP to your email");
         // Handle success response
         history.push('/login');
        setToast(true);       
      } else {
        // Capture additional details if the response is not OK
        const errorDetail = data.error || "An unknown error occurred.";
        setText(errorDetail);
        setStatusColor("danger"); // Handle error response
        setToast(true);
      }
    } catch (error) {
      setText("An error occurred. Please try again.");
      setStatusColor("danger");
      setToast(true)
    } finally {
      setIsSubmitting(false); // Re-enable button after submission completes
    }
  };

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = "auto";
  }, []);

  const logo = "/assets/icon.png";

  return (
    <IonPage style={{ textAlign: "center" }}>
      <div className={styles.content}>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <img src={logo} style={{ width: "20%", padding: "10px" }} alt="logo" />
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.write}>
            <h1 style={{ fontWeight: "100", fontSize: "25px", marginBottom: "-10px" }}>
              SIGN UP
            </h1>
            <p>Create an account</p>
          </div>
          <div>
            <input
              type="text"
              placeholder="First name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={styles.inputs}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Last name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className={styles.inputs}
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email address"
              name="email"
              value={formData.signupEmail}
              onChange={handleChange}
              required
              className={styles.inputs}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className={styles.inputs}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.signupPassword}
              onChange={handleChange}
              required
              className={styles.inputs}
            />
          </div>
          <div>
            <button 
              type="submit"
              disabled={isSubmitting} // Disable button when submitting
              style={{
                padding: "12px",
                width: "85%",
                borderRadius: "6px",
                fontSize: "16px",
                marginTop: "12px",
                backgroundColor: isSubmitting ? "#ccc" : "#19fb04", // Change color when disabled
                border: "none",
              }}
            >
              {isSubmitting ? "Almost there..." : "Sign up"} {/* Change button text */}
            </button>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "15px",
            }}
          >
            <hr style={{ width: "20%", borderBottom: "1px ", height: "0" }} />
            <p style={{ color: "#748177", fontSize: "15px" }}>or continue with</p>
            <hr style={{ width: "20%", height: "0", borderBottom: "1px " }} />
          </div>
          <div>
            <button
              type="button"
              style={{
                padding: "12px",
                width: "85%",
                borderRadius: "6px",
                fontSize: "16px",
                backgroundColor: "bab6b5",
                border: "none",
                margin: "auto",
                display: "flex",
                alignItems:"center",
                justifyContent:"center",
                height: "40px"
              }}
            >
              <IonToast isOpen={toast} onDidDismiss={() => setToast(false)} message={text} duration={6000} position="top" color={statusColor} />
              <img src="/assets/google.png" style={{width: "10%",}} alt="google icon" />
              Google
            </button>
            
            <div style={{marginTop:"5px"}}>Already a member? <span style={{color:"#19fb04"}} onClick={()=>history.push('/login')}>Login</span></div>

            <div style={{ marginTop: "40px" }}>
              <p style={{ margin: "0", color: "#748177", fontSize: "15px" }}>
                By clicking continue, you agree to our
              </p>
              <p style={{ margin: "0", fontSize: "15px", fontWeight: "100" }}>
                Terms of Service <span style={{ color: "#748177", fontSize: "15px" }}>and</span> Privacy Policy
              </p>
            </div>
          </div>
        </form>
      </div>
    </IonPage>
  );
};

export default Signup;
