import React, { useState, useEffect } from "react";
import { IonContent, IonPage, IonModal, IonButton, IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";
import style from "./style/IntroPage.module.css";
import { useHistory } from "react-router";
import axios from "axios";


const IntroPage: React.FC = () => {
  const content = [
    { image: "/assets/happyman.jpeg", text: "Convenient expert services, right at your door." },
    { image: "/assets/carpenter.jpeg", text: "Crafting your dream spaces with skilled hands." },
    { image: "/assets/Chef.jpeg", text: "Delicious meals made to satisfy your taste." },
    { image: "/assets/blackCleaner.jpeg", text: "Bringing cleanliness to every corner." },
    { image: "/assets/wallpainter.jpeg", text: "Revitalize your space with vibrant colors." },
    { image: "/assets/engworker.jpeg", text: "Expert solutions for all your technical needs." },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState("service1");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % content.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [content.length]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSegmentChange = (e: any) => {
    setSelectedSegment(e.detail.value);
  };

  const logo = "/assets/Icon.svg";
  const facebook = "/assets/svg/facebook.svg";
  const google = "/assets/svg/google.svg";
  const emailSvg = "/assets/svg/email.svg";
  const passwordSvg = "/assets/svg/password.svg";

  /**********************LOGIN *****************************/


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [text, setText] = useState('');
  const history = useHistory();
  const [, forceUpdate] = useState(0);

  const [toast, setToast] = useState<boolean>(false)
  const [statusColor, setStatusColor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

                                                          
  useEffect(() => {
    document.body.style.fontFamily = "Varela Round, sans-serif";
    document.body.style.overflowX = "hidden";
  }, []);

  const endpoint = "http://localhost/hq2ClientApi/login.php";

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);

    e.preventDefault();

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
          },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.success) {
            setText('Login successful!');
            setStatusColor('success');
            setToast(true);
            closeModal();
            localStorage.setItem("userInfo", JSON.stringify(data.user));
            localStorage.setItem("token", data.token) ;
            sessionStorage.setItem("userInfo", JSON.stringify(data.user));
            sessionStorage.setItem("token", data.token) ;// Save user info to context
            history.push('/dashboard');
            forceUpdate((prev) => prev + 1);
        } else {
            setIsSubmitting(false);
            setText(data.error );
            setStatusColor("danger");
            setToast(true);
            console.error('Login failed:', data.message);
        }
    } catch (error) {
      setIsSubmitting(false);
        setText('An error occurred while logging in. Check your internet connection');
        setStatusColor("danger");
        setToast(true);
        console.error('Error:', error);
    }finally{
      setIsSubmitting(false);
    }
};


const guestMode = () => {
  setShowModal(false)
  history.push("/dashboard")
}

  
useEffect(()=>{
  if(localStorage.getItem("Intro")  === "seen"){
    setShowModal(true)
  }
},[])

  /***************************************END OF LOGIN */
  


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    signupEmail: "",
    phone: "",
    signupPassword: "",
    confirmPassword: "",
    role: "clients",
  });
  
  const [passwordError, setPasswordError] = useState(""); // Track password mismatch error
  

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const createPaystackAccount = async (user: { email: string; first_name: string; last_name: string, user_id: string }) => {
    try {
      const response = await axios.post("http://localhost/hq2ClientApi/createVirtualAccount.php", user);
      console.log("Paystack Account Created:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating Paystack account:", error);
    }
  };
  

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
  
    if (formData.signupPassword !== formData.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return; // Stop form submission if passwords don't match
    } else {
      setPasswordError(""); // Clear error if passwords match
    }
  
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
        createPaystackAccount({ email: formData.signupEmail, first_name: formData.firstName, last_name: formData.lastName, user_id: data.user_id });
        setSelectedSegment('service1');
        setToast(true);
      } else {
        const errorDetail = data.error || "An unknown error occurred.";
        setText(errorDetail);
        setStatusColor("danger");
        setToast(true);
      }
    } catch (error) {
      setText("An error occurred. Please try again.");
      setStatusColor("danger");
      setToast(true);
    } finally {
      setIsSubmitting(false); // Re-enable button after submission completes
    }
  };
  



  return (
    <IonPage
      className={style.blend}
      style={{
        backgroundImage: `url(${content[currentIndex].image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <IonContent className={style.content}>
        <div className={style.overlay}>
          <div className={style.write}>
            <div className={style.topCont}>
              <h1 className={style.text}>{content[currentIndex].text}</h1>
            </div>
            <div style={{textAlign: "center"}}>
              <button className={style.get} style={{background: "white", color: "var(--ion-company-wood)"}} onClick={guestMode}>
                CONTINUE AS GUEST
              </button>
            </div>
            <div style={{paddingBlock: "5px", textAlign: "center", color: "white"}}>- OR -</div>
            <div className={style.bottomCont}>
              <button className={style.get} style={{color: "white", background: "var(--ion-company-wood)", fontWeight: "800"}} onClick={openModal}>
                SIGN IN
              </button>
            </div>

          </div>
        </div>

        {/* Modal */}
        <IonModal
          isOpen={showModal}
          onDidDismiss={closeModal}
          className={style.bottomModal}
// You can also customize this to add more options if necessary
        >
          <div className={style.modalContent}>
            <div className={style.modalHeader}>
              <div className={style.logo}>
                <img src={logo} />
              </div>
              <div className={style.topHead}>
                {selectedSegment === "service1" && (
                  <div className={style.headCont}>
                    <div className={style.bigHead}>Login</div>
                    <div className={style.smallHead}>Unlock convenience and dive right in!</div>
                  </div>
                ) }
                {selectedSegment === "service2" && (
                  <div className={style.headCont}>
                    <div className={style.bigHead}>Sign Up</div>
                    <div className={style.smallHead}>Join now and make life effortless</div>
                  </div>
                )}
              </div>
              <IonSegment value={selectedSegment} className={style.segCont} mode="ios" onIonChange={handleSegmentChange}>
                <IonSegmentButton className={style.segBut} value="service1">
                  <IonLabel className={style.lab}>Login</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton className={style.segBut} value="service2">
                  <IonLabel className={style.lab}>Sign up</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </div>

            <div className={style.segmentContent}>
              {selectedSegment === "service1" && (
                <form onSubmit={handleLogin}>
                  <div className={style.inputCont}>
                    <label className={style.labInput}>Email</label>
                    <div className={style.input}>
                    <input
                      type="email"
                      className={style.detail}
                    name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder='Email address'
                      required
                    />
                    </div>                    
                  </div>

                  <div className={style.inputCont}>
                    <label className={style.labInput}>Password</label>
                    <div className={style.input}>
                    <input
                        type="password"
                        name="password"
                        placeholder='Password'
                        className={style.detail}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>                    
                  </div>
                  <div className={style.butCont}>
                    <button className={style.but} disabled={isSubmitting}>{isSubmitting ? "Almost there..." : "Login" }</button>
                  </div>
                  <div className={style.forgot}>
                    forgot password?
                  </div>
                  <div className={style.not}>
                    By using our services you agree to our Terms of Service and Data Privacy
                  </div>
                </form>
              )}
              {selectedSegment === "service2" && (
                <form onSubmit={handleSubmit}>
                <div className={style.double}>
                  <div className={style.col}>
                  <div className={style.inputCont}>
                    <label className={style.labInput}>First name</label>
                    <div className={style.input}>
                      <input placeholder="john" name="firstName" value={formData.firstName} onChange={handleChange} className={style.detail} type="text" />
                    </div>                    
                  </div>
                  </div>
                  <div className={style.col}>
                  <div className={style.inputCont}>
                  <label className={style.labInput}>Last name</label>
                  <div className={style.input}>
                    <input placeholder="doe" name="lastName" value={formData.lastName} onChange={handleChange} className={style.detail} type="text" />
                  </div>                    
                </div>
                  </div>
                </div>
                <div className={style.inputCont}>
                  <label className={style.labInput}>Email</label>
                  <div className={style.input}>
                    <input placeholder="johndoe@gmail.com" name="signupEmail" value={formData.signupEmail} onChange={handleChange} className={style.detail} type="text" />
                  </div>                    
                </div>
                <div className={style.inputCont}>
                <label className={style.labInput}>Phone number</label>
                <div className={style.input}>
                  <input className={style.detail} name="phone" value={formData.phone} onChange={handleChange} type="text" />
              </div>                    
              </div>
                <div className={style.inputCont}>
                  <label className={style.labInput}>Password</label>
                  <div className={style.input} style={{border: passwordError ? "1px solid red" : ""}}>
                    <input className={style.detail} name="signupPassword" value={formData.signupPassword} onChange={handleChange} type="text" />
                  </div>                    
                </div>
                  <div className={style.inputCont}>
                  <label className={style.labInput}>Confirm Password</label>
                  <div className={style.input} style={{border: passwordError ? "1px solid red" : ""}}>
                    <input className={style.detail} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="text" />
                  </div>                    
                </div>
                <div className={style.butCont}>
                  <button className={style.but} type="submit" disabled={isSubmitting}>{isSubmitting ? "Setting Account" : "Sign up"}</button>
                </div>
                <div className={style.not}>
                    By Signing up you agree to our Terms of Service and Data Privacy
                  </div>
                {/* <div className={style.or}>
                  or continue with
                </div> */}
                {/* <div className={style.svgCont}>
                    <div className={style.svg}>
                      <img src={google} />
                    </div>
                    <div style={{background: "#039be5"}} className={style.svg}>
                      <img src={facebook} />
                    </div>
                </div> */}
              </form>
              )}
            </div>
            <div onClick={guestMode} style={{textAlign: "center", marginTop: "1rem", fontSize: "19px", fontWeight: "700"}}>Continue as guest!</div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default IntroPage;
