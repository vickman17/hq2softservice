import { IonModal, IonContent } from "@ionic/react";
import React from "react";
import CloseModal from "./CloseModal";
import { boat } from "ionicons/icons";
// import PaystackPayment from "./PaystackPayment";
import { useState } from "react";
import {useHistory} from "react-router";

interface CardProps {
    isOpen: boolean;
    onClose: () => void; 
}

const CardPayment: React.FC<CardProps> = ({isOpen, onClose}) => {
    const history = useHistory();
    const [payAmount, setPayAmount] = useState<number>(0);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value === "" ? 0 : Number(e.target.value); // Handle empty input case
      
        if (inputValue > 0) {
           setPayAmount(inputValue); // Update the amount
        } else {
            setPayAmount(0); // Reset input field
        }
      };
      
const success = () => {
    history.push("/dashboard")
} 

    return(
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            <div style={{paddingBlock: "10px"}} onClick={onClose}>
                <CloseModal title="" color="black" />
            </div>
            <IonContent>
                <div style={{border: "0px solid", width: "95%", margin: "auto"}}>
                    <div style={{fontSize: "28px", marginTop: "40px", fontWeight: "600", color: "var(--ion-company-wood)" }}>Top up {"(credit card)"} </div>
                    <div style={{color: "grey", fontSize: "15px", fontWeight: "700", marginTop: "25px"}}>Amount</div>
                    <div style={{border: "0px solid", display: "flex", borderRadius: "14px", background: "#f1f1f1", marginTop: "0px", paddingBlock: "5px", alignItems: "center", fontSize: "21px"}}>
                        <div style={{paddingInline: "5px"}}>
                        &#8358; 
                        </div>
                        <div>
                            <input type="number" value={payAmount > 0 ? payAmount : ''} onChange={handleAmountChange} style={{background: "transparent", border: "0px solid", outline: "none"}} />
                        </div>
                    </div>
                    <div style={{marginTop: "30px"}}> 
                        {/* <PaystackPayment transactionType="top up" amount={payAmount} /> */}
                    </div>
                </div>
            </IonContent>
        </IonModal>
    )
}


export default CardPayment;