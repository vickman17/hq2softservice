import React, { useState, useRef, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonButton,
  IonToast,
  IonSpinner,
  IonModal,
} from "@ionic/react";
import style from "./styles/OtpPage.module.css";
import { useHistory } from "react-router";

const OtpPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", ""]);
  // const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [showToast, setShowToast] = useState<{ message: string; color: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState<number>(60); // Countdown in seconds
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const verified = "/assets/svg/phoneVerified.svg";
  const storedInfo = sessionStorage.getItem("Info");
  const info = storedInfo ? JSON.parse(storedInfo) : {};
  const phone = info?.phone1 || null;
  const email = info?.email || null;
  const formattedPhone = phone?.startsWith("0") ? "+234" + phone.slice(1) : phone;
  const history = useHistory();
  const profession = info?.category_id;


  useEffect(() => {
    sendOtp();
    document.body.style.fontFamily = "Nunito, sans-serif";
  }, []);

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const sendOtp = async () => {
    setCountdown(60);
    setIsResendDisabled(true);

    try {
      await sendOtpRequest();
      setShowToast({ message: "OTP sent successfully.", color: "success" });
    } catch (error: any) {
      setShowToast({ message: error.message || "Failed to send OTP.", color: "danger" });
      setIsResendDisabled(false);
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOtpRequest = async () => {
    const response = await fetch("http://localhost/hq2sspapi/handleOtp.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "send",
        phone_number: formattedPhone,
        
      }),
    });


    console.log(email)
    if (!response.ok) {
      throw new Error("Failed to send OTP. Please try again.");
    }

    const result = await response.json();
    if (result.status !== "success") {
      throw new Error(result.message || "Failed to send OTP.");
    }
  };

  const handleInputChange = (
    index: number,
    value: string,
    event?: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    const isDeleting = event?.nativeEvent instanceof InputEvent &&
      event.nativeEvent.inputType === "deleteContentBackward";

    newOtp[index] = value;
    setOtp(newOtp);

    if (isDeleting && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (!isDeleting && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = event.clipboardData.getData("Text");
    const digits = pasteData.replace(/\D/g, "").slice(0, otp.length);

    if (digits.length === 0) return;

    const newOtp = otp.map((_, index) => digits[index] || "");
    setOtp(newOtp);

    const lastFilledIndex = digits.length - 1;
    if (inputRefs.current[lastFilledIndex]) {
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleContinue = () => {
    setIsModalOpen(false);
    history.push("/dashboard");
  };

  const handleSubmit = async (otpValue: string) => {
    if (otpValue.length < 5) {
      setShowToast({ message: "Please fill all OTP fields.", color: "danger" });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost/hq2sspapi/handleOtp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          phone_number: formattedPhone,
          otp: otpValue,
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to verify OTP. Please try again.");
      }

      const result = await response.json();
      if (result.status === "success") {
        setShowToast({ message: "OTP verified successfully!", color: "success" });
        setIsModalOpen(true);
      
          if (profession === null) {
            history.push("/completeprofile");
          }
      } else {
        setShowToast({ message: result.message || "Invalid OTP.", color: "danger" });
      }
    } catch (error: any) {
      setShowToast({ message: error.message || "An error occurred. Please try again.", color: "danger" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputRefs = useRef<(HTMLInputElement)[]>([]);


  return (
    <IonPage>
      <IonContent className={style.otpPag}>
        <div className={style.otpContainer}>
          <div className={style.head}>
            <div className={style.bigHead}>Verify OTP</div>
            <p className={style.smallHead}>
              We've sent a 5-digit verification code to <span style={{color: "var(--ion-company-primary)", fontWeight: "600"}}>{formattedPhone}</span>
            </p>
          </div>
          <div className={style.otpInputs}>
            {otp.map((value, index) => (
              <div key={index} className={style.inputBorder}>
                <input
                  ref={(el) => {
                    if (el) inputRefs.current[index] = el; // Assign the element to the ref array
                  }}
                  type="text"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleInputChange(index, e.target.value, e)}
                  onPaste={handlePaste}
                  className={style.otpInput}
                  autoFocus={index === 0}
                />
              </div>
            ))}
          </div>
          <div className={style.verify}>
            <button
              onClick={() => handleSubmit(otp.join(""))}
              disabled={otp.some((digit) => digit === "") || isSubmitting}
              className={style.submitBtn}
            >
              {isSubmitting ? <IonSpinner /> : "Verify OTP"}
            </button>
          </div>
          <div onClick={sendOtp} className={style.resendBtn}>
            {isResendDisabled
              ? `Re-send OTP in ${formatCountdown(countdown)}`
              : "Re-send OTP"}
          </div>
          {showToast && (
            <IonToast
              isOpen={!!showToast}
              message={showToast.message}
              color={showToast.color}
              duration={2000}
              onDidDismiss={() => setShowToast(null)}
            />
          )}
        </div>
        <IonModal isOpen={isModalOpen} className={style.customModal}>
          <div className={style.modalCard}>
            <div className={style.modalTitle}>
              OTP Verified
            </div>
            <div>
              <img src="/svgnew/numberV.svg" className={style.image} alt="Verified" />
            </div>
            <div className={style.modalMessage}>
              Your phone number has been successfully verified!
            </div>
            <button
              onClick={handleContinue}
              className={style.modalButton}
            >
              Continue
            </button>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default OtpPage;
