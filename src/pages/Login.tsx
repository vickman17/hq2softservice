import React, { useEffect, useState } from 'react';
import { IonPage, IonToast } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import styles from "./style/Login.module.css";
import { useUser} from '../hooks/UserContext'; // Import the hook

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [text, setText] = useState('');
  const history = useHistory();
  const { saveUserInfo } = useUser(); // Use the custom hook
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
            localStorage.setItem("userInfo", JSON.stringify(data.user));
            localStorage.setItem("token", data.token) ;
            sessionStorage.setItem("userInfo", JSON.stringify(data.user));
            sessionStorage.setItem("token", data.token) ;// Save user info to context
            history.push('/dashboard');
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


  const logo = '/assets/icon.png';

  return (
    <IonPage className={styles.page}>
      <div>
        <div style={{ textAlign: "center", marginTop: "5rem" }}>
          <img src={logo} style={{ width: "20%", padding: "12px" }} alt="Logo" />
          
        </div>
        <form className={styles.form} onSubmit={handleLogin}>
          <h1 style={{ fontWeight: "100", fontSize: '25px', marginBottom: '-10px' }}>SIGN IN</h1>
          <p style={{ fontSize: '16px' }}>Sign in to your account</p>
          <div style={{ color: 'red' }}>

          </div>
          <div>
            <input
              type="email"
              className={styles.inputs}
             name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email address || Phone number'
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder='Password'
              className={styles.inputs}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button
              style={{ padding: "12px", width: '85%', borderRadius: "6px", fontSize: "16px", marginTop: "12px",  backgroundColor: isSubmitting ? "#ccc" : "#19fb04", border: 'none' }}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Almost ready..." : "Sign in"}
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", margin: "15px", }}>
            <hr style={{ width: '20%', borderBottom: "1px ", height: "0" }} />
            <p style={{ color: "#748177", fontSize: '15px' }}>or continue with</p>
            <hr style={{ width: '20%', height: "0", borderBottom: "1px " }} />
          </div>
          <div>
            <button style={{ padding: "12px", width: '85%', borderRadius: "6px", fontSize: "16px", backgroundColor: "bab6b5", border: 'none', alignItems:"center", display:"flex", textAlign:"center", justifyContent:"center", margin: "auto" }}>
            <img src="/assets/google.png" style={{width: "10%",}} alt="google icon" />
              Google</button>
            <div style={{marginTop:"5px"}}>Don't have an account? <span style={{color:"#19fb04"}} onClick={()=>history.push('/signup')}>Sign up</span></div>
            <IonToast isOpen={toast} onDidDismiss={() => setToast(false)} message={text} duration={6000} position="top" color={statusColor} />
            <div style={{ marginTop: "40px" }}>
              <p style={{ margin: "0", color: "#748177", fontSize: '15px' }}>By clicking continue, you agree to our</p>
              <p style={{ margin: "0", fontSize: '15px', fontWeight: "100", }}>Terms of Service <span style={{ color: "#748177", fontSize: '15px' }}>and</span> Privacy Policy</p>
            </div>
          </div>
        </form>
      </div>
    </IonPage>
  );
};

export default Login;

