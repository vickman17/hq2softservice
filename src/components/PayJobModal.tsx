import React, { useState, useEffect } from "react";
import { IonModal, IonButton, IonContent } from "@ionic/react";
// import PaystackPayment from "./PaystackPayment";
import CloseModal from "./CloseModal";
import { Job } from "../types";
import RatingComponent from "./RatingComponent";
import style from "./PayModal.module.css";
import loader from "/assets/loader.gif";
import ResultModal from "./ResultModal";
import success from "/assets/svg/success.svg";
import fail from "/assets/svg/fail.svg";
import warning from "/assets/svg/warning.svg";
import { useHistory } from "react-router";
import { sync } from "ionicons/icons";


interface PayJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobId: string;
    amount: number;
    job: Job[];
    userId: string;
}

const PayJobModal: React.FC<PayJobModalProps> = ({ isOpen, onClose, jobId, amount, job, userId }) => {
    const [isPaying, setIsPaying] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"wallet" | "paystack" | null>("wallet");
    const userInfoString = sessionStorage.getItem("userInfo");
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
    const [openResult, setOpenResult] = useState<boolean>(false);
    const [resultImg, setResultImg] = useState<any>();
    const [resultStatus, setResultStatus] = useState("");
    const [resultReason, setResultReason] = useState("");
    const [walletBalance, setWalletBalance] = useState<number>(0.00);
    const [jobDetails, setJobDetails] = useState<Job | null>(null); // Change from Job[] to Job | null
    const [Insufficient, setInsufficient] = useState(false);

    const handleRatingSubmit = (rating: number, feedback: string) => {
        fetch("http://localhost/hq2ClientApi/saveRating.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, jobId, rating, feedback }),
        })
          .then((res) => res.json())
          .then((data) => setPaymentMethod("wallet"));
      };
    
      const closeResult = () => {
        setOpenResult(false);
        history.push("/dashboard");
      }


    useEffect(() => {
        if (isOpen) {
            fetchUserAccount(userId);
            setJobDetails(job[0])
        }
        
    }, [isOpen, userId]); // Runs when modal opens

    const fetchUserAccount = async (userId: string) => {
        try {
            const response = await fetch("http://localhost/hq2ClientApi/getAccountDetails.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }), // Send userId as JSON
            });
    
            const data = await response.json();
    
            if (data.error) {
                console.error("Error fetching account:", data.error);
            } else {
                const balance = parseFloat(data[0].balance);
                setWalletBalance(balance);                
                console.log("User account data:", data[0].balance); 
                console.log(Insufficient)
                return data; // Return data for further processing
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };
    

    // const description = `Payment for ${jo} `

      
    


    // Example usage:
    
    const handleWalletPayment = async () => {
        console.log(`wallet balance ${walletBalance}`);
        console.log(`amount ${amount}`);

        const numericAmount = Number(amount);
    
        if (isNaN(numericAmount)) {
            console.error("Invalid amount:", amount);
            return; // Stop execution if amount is not a valid number
        }

        const formattedAmount = parseFloat(numericAmount.toFixed(2)); // Ensure decimal format
        const description = jobDetails?.skill;

        setIsPaying(true);
        try {
            const response = await fetch("http://localhost/hq2ClientApi/jobPayment.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, jobId, formattedAmount, description})
            });
            const data = await response.json();
            if (data.success) {
                console.log(jobDetails?.skill)
                setResultImg(success);
                setResultReason("Successful");
                setResultStatus("Successful");
                setOpenResult(true);
                onClose();
            } else {
                setResultImg(fail);
                setResultReason("Failed");
                setResultStatus("Failed");
                setOpenResult(true);
                // onClose();            
            }

        } catch (error) {
            console.error("Error processing wallet payment:", error);
        }finally{
        setIsPaying(false);
        }
    };

    useEffect(() => {
        if(walletBalance < amount){
        setInsufficient(true);
        return;
        }

        setInsufficient(false)
    }, [walletBalance, amount]); // Update `Insufficient` whenever `walletBalance` or `amount` changes

    const handlePaystackSuccess = async () => {
        try {
            const response = await fetch("http://localhost/hq2ClientApi/updateJobStatus.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId, status: "completed" })
            });
            const data = await response.json();
            if (data.success) {
                alert("Job marked as completed!");
                onClose();
            }
        } catch (error) {
            console.error("Error updating job status:", error);
        }
    };

    const history = useHistory();

    const topup = () => {
        onClose();
        history.push("/wallet")
    }

    const formatAmount = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            <IonContent>
                <div onClick={onClose}>
                    <CloseModal color="black" title="" />
                </div>
                <div style={{textAlign: "center", fontSize: "18px", fontWeight: "600", color: "var(--ion-company-wood)", paddingBlock: "10px"}}>
                    Payment Information
                </div>
                <div style={{ paddingTop: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "35px", fontFamily: "roboto", fontWeight: "600" }}>
                    ₦{formatAmount(amount)}
                </div>
                    <div style={{fontSize: "13px", fontWeight: "600", color: "var(--ion-company-wood)"}}>
                        {jobDetails?.skill}
                    </div>
                    <div style={{fontSize: "12px", paddingTop: "5px"}}>
                        {Insufficient ? <div style={{color: "red"}}>Insufficient Balance, <span onClick={topup} style={{textDecoration: "underline", color: "var(--ion-company-gold)"}}>Top up wallet</span></div> : ""}
                    </div>
                    <div className={style.detailField}>
                        <div className={style.row}>
                            <div className={style.col}>Address:</div> 
                           <div className={style.col2}>{jobDetails?.address}</div>
                        </div>
                        <div className={style.row}>
                            <div className={style.col}>State / LGA</div>
                            <div className={style.col2}>{jobDetails?.local_government}, {jobDetails?.state}</div>
                        </div>
                        <div className={style.row}>
                            <div className={style.col}>Urgency:</div> 
                           <div className={style.col2}>{jobDetails?.urgency}</div>
                        </div>
                        <div className={style.row}>
                            <div className={style.col}>Additional Details:</div> 
                           <div className={style.col2}>{jobDetails?.additional_details}</div>
                        </div>
                    </div>
                    <div>
                        <RatingComponent userId={userId} jobId={jobId} onSubmit={handleRatingSubmit} />
                    </div>

{/*                     
                    <IonButton 
                        onClick={() => setPaymentMethod("wallet")} 
                        // disabled={isPaying || walletBalance < amount}
                    >
                        Pay with Wallet
                    </IonButton> */}
{/*                     
                    <IonButton 
                        onClick={() => setPaymentMethod("paystack")} 
                        disabled={isPaying}
                    >
                        Pay with Paystack
                    </IonButton> */}
                    <div style={{display: Insufficient ? "hidden" : "visible", marginTop: "1rem"}}>
                    {Insufficient ? "" : <button style={{width: "95%", color: "white", display: Insufficient ? "hidden" : "visible", borderRadius: "1.5rem", paddingBlock: isPaying ? "5px" : "15px", marginTop: "2rem", fontSize: "18px", fontWeight: "700", background: "var(--ion-company-wood)"}} onClick={handleWalletPayment} disabled={isPaying}>{isPaying ? <img width={20} src={loader} />: "Confirm & Pay"}</button>}    
                    </div>                    
                    {/* {paymentMethod === "paystack" && <PaystackPayment transactionType="Job Payment" amount={amount * 100} onSuccess={handlePaystackSuccess} />} */}
                </div>
            </IonContent>
            <ResultModal image={resultImg} paymentStatus="" isOpen={openResult} reason={resultReason} onClose={closeResult} />
        </IonModal>
    );
};

export default PayJobModal;
