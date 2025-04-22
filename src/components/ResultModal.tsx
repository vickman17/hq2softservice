import { IonContent, IonModal } from "@ionic/react";
import React from "react";

interface Result {
    image: string;
    paymentStatus: string;
    reason: string;
    isOpen: boolean;
    onClose: ()=>void;
}


const ResultModal: React.FC<Result> = ({image, paymentStatus, reason, isOpen, onClose}) => {


    console.log(image)
return(
    <IonModal isOpen={isOpen}>
        <IonContent>
            <div style={{width: "90%", margin: "auto", textAlign: "center", marginTop: "3rem"}}>
                <img src={image} width={80}/>
            </div>
            <div style={{border: "0px solid", color: "var(--ion-company-wood)", fontSize: "14px", fontWeight: "700", textAlign: "center"}}>
                Payment {reason}
            </div>
            <div style={{width: "90%", margin: "auto", marginTop: "6rem", textAlign: "center"}}>
                <button onClick={onClose} style={{width: "100%", borderRadius: "1.7rem", fontWeight: "700", background: "transparent", color: "var(--ion-company-wood)", border: "1px solid var(--ion-company-wood)", fontSize: "18px", paddingBlock: "10px"}}>
                    Close
                </button>
            </div>
        </IonContent>
    </IonModal>
)

}

export default ResultModal;