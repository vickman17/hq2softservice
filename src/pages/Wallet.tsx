import { IonPage, IonContent, IonModal, IonHeader, IonIcon } from "@ionic/react";
import React, { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import style from "./style/Wallet.module.css";
import AccountDetailsModal from "../components/AccountDetailsModal";
import Back from "../components/Back";
import { arrowBack } from "ionicons/icons";
import CloseModal from "../components/CloseModal";
import CardPayment from "../components/CardPayment";
import eye from "/assets/svg/eye.svg";
import eyeClose from "/assets/svg/eyeClose.svg";
import { useHistory } from "react-router";

interface Transaction {
    transaction_id: string;
    description: string;
    amount: string;
    status: string;
    channel: string;
    created_at: string;
    reference: string;
}


const Wallet: React.FC = () => {
    const [addMoney, setAddMoney] = useState<boolean>(false);
    const [balance, setBalance] = useState<number>(0.00);
    const userDetails = sessionStorage.getItem("userInfo");
    const parsedData = userDetails ? JSON.parse(userDetails) : null;
    const email = parsedData?.email || "ghost@example.com";
    const userId = parsedData?.user_id || "guest";
    const [account, setAccount] = useState<any | null>(null);
const history = useHistory();
    const [openDetails, setOpenDetails] = useState<boolean>(false);

    const closeDetails = () => {
        setOpenDetails(false)
    }

    const closeAddMoney = () => {
        setAddMoney(false);
    }

    const [card, setCard] = useState<boolean>(false);

    const openCard =()=> {
        setCard(true);
    }

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
                setAccount(data[0] || null)
                const balance = parseFloat(data[0].balance);
                setBalance(balance);                
                console.log("User account data:", data[0].balance); 
                return data; // Return data for further processing
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    useEffect(()=>{
        fetchUserAccount(userId)
    }, [])

    const formatAmount = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const [showBalance, setShowBalance] = useState(true);


const [transactions, setTransactions] = useState<Transaction[]>([]);
const [loading, setLoading] = useState<boolean>(true);

useEffect(() => {
    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost/hq2ClientApi/fetchTransactions.php?userId=${userId}`);
            const data = await response.json();

            if (data.success) {
                setTransactions(data.transactions);
            } else {
                console.error("Error fetching transactions:", data.message);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchTransactions();
}, [userId]);

console.log(transactions[0])


    return(
        <IonPage>
            {userDetails ?
            <IonContent style={{'--background':"#d9d9d9", "--overflow": "hidden"}}>
                <div style={{background:"var(--ion-company-wood)", color:"white", paddingBottom:"7rem"}}>
                   <div style={{padding:"1rem"}}> 
                   <div style={{fontSize: "14px", marginTop: "1rem"}}>Balance</div>
                        <div style={{marginTop: "0", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div style={{ fontSize: "38px", marginTop: "0", fontWeight: "600", fontFamily: "roboto" }}>
            {showBalance ? (
                `₦${balance ? balance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}`
            ) : (
                "₦******"
            )}
        </div>
        <div onClick={() => setShowBalance(!showBalance)} style={{ cursor: "pointer" }}>
            <img src={showBalance ? eye : eyeClose} alt="Toggle Balance" />
        </div>
                        </div>
                    </div>
                    
                    <div style={{border:"0px solid white", textAlign:"center", marginTop:"3rem"}}>
                        <button className={style.add} onClick={()=>setAddMoney(true)}>Top Up +</button>
                    </div>
                </div>
                <div style={{background:"#d9d9d9", marginTop:"-3rem", padding:"1rem", borderTopLeftRadius:"3rem", borderTopRightRadius:"3rem"}}>
                    <div className={style.history}>
                        <div style={{fontSize:"18px", fontWeight: "500"}}>Payment History</div>
                        <div style={{fontSize:"10px", fontWeight: "600"}}>Includes direct payments history and wallet activity</div>  
                    </div>
                    <div>
                    {loading ? (
                <p>Loading transactions...</p>
            ) : transactions.length > 0 ? (
                <div style={{border: "0px solid", overflowY: "scroll", height: "60vh", marginTop: ".5rem", paddingBottom: "4.5rem"}}>
                    {transactions.map((transaction) => (
                        <div 
                            key={transaction.reference} 
                            style={{
                                border: "1px solid #ccc",
                                padding: "10px",
                                background: "#ccc",
                                marginBottom: "10px",
                                borderRadius: "8px",
                            }}
                        >
                            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                                <div style={{fontSize: "18px", fontWeight: "700", color: "var(--ion-company-wood)"}}>{transaction.description}</div>
                                <div style={{fontSize: "18px", fontWeight: "900", color: "var(--ion-company-wood)"}}>₦{transaction.amount}</div>
                            </div>
                            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                                <div style={{fontSize: "15px", fontWeight: "700", color: "var(--ion-company-wood)"}}>{new Date(transaction.created_at).toLocaleString()}</div>
                                <div style={{fontSize: "18px", fontWeight: "700", color: transaction.status === "successful" ? "var(--ion-company-wood)" : "var(--ion-company-gold)"}}>{transaction.status}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No transactions found</p>
            )}
                    </div>
                </div>
            </IonContent>
             :  <div style={{border: "0px solid black", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "700"}}>
                            Please <span onClick={()=>history.push("/home")} style={{color: "var(--ion-company-gold)", textDecoration: "underline"}}> &nbsp;Login&nbsp; </span> to continue using our service
                      </div>}
            <IonModal isOpen={addMoney}> 
            <div onClick={closeAddMoney} style={{border: "0px solid black", width: "fit-content"}}>
                <CloseModal title=" " color="black" />
            </div>
                <IonContent style={{"--height": "100vh", "--overflow": "hidden"}}>
                    <div style={{border: "0px solid", height: "100vh", width:"95%", margin: "auto"}}>
                        <div style={{fontSize: "29px", fontWeight: "600", color: "var(--ion-company-wood)", marginTop: "50%"}}>Payment Method</div>
                        <div style={{fontSize: "15px", color: "grey"}}>Choose Preferred Payment Method.</div>
                        <div style={{border: "0px solid", marginTop: "20px"}}>
                            <div className={style.but} onClick={()=>setOpenDetails(true)} style={{background: "var(--ion-company-wood)", color: "white"}}>
                                Bank Transfer - <span style={{fontSize: "14px"}}>Recommended</span>
                            </div>
                            <div className={style.but} style={{background: "#f5f5f5", color: "grey"}}>
                                Credit Card - <span style={{fontSize: "14px"}}>Disabled!</span>
                            </div>
                        </div>
                    </div>
                </IonContent>
            </IonModal>
            <AccountDetailsModal account={account} isOpen={openDetails} closeModal={closeDetails} />
            <CardPayment isOpen={card} onClose={()=>setCard(false)} />
        </IonPage>
    )
}

export default Wallet