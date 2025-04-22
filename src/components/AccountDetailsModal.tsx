import React, {useEffect, useState} from "react";
import { IonContent, IonHeader, IonIcon, IonModal } from "@ionic/react";
import { arrowBack, copy } from "ionicons/icons";
import style from "./AccountDetailsModal.module.css";
import CloseModal from "./CloseModal";


interface AccountDetails {
    account_name?: string;
    account_number?: string;
    bank_name?: string;
}

interface Details {
    isOpen: boolean;
    closeModal: () => void;
    account?: AccountDetails; // Allow account to be optional
}


const AccountDetailsModal: React.FC<Details> = ({ isOpen, closeModal, account}) => {

    const [copied, setCopied] = useState<Boolean>(false);


    useEffect(()=>{
        setCopied(false)
    },[closeModal])
console.log(account)

    return(
        <IonModal isOpen={isOpen} onDidDismiss={closeModal}>
            <div onClick={closeModal} style={{border: "0px solid black", width: "fit-content"}}>
                <CloseModal title="" color="black" />
            </div>
            <IonContent>
                <div style={{width: "95%", margin: "auto", marginTop: "2rem"}}>
                    <div style={{fontSize: "30px",fontWeight: "700", color: "var(--ion-company-wood)"}}>Bank Transfer</div>
                    <div style={{border: "1px solid #DAA520", width: "fit-content", fontSize: "13px", paddingInline: "3px", borderRadius: "5px", color: "#DAA520"}}>Recommended</div>
                    <div style={{marginTop: "10px"}}>Top up wallet with ease, make seamless transfer to personal wallet account</div>
                </div>
                <div className={style.detailsCont}>
                    <div className={style.details}>
                        <div className={style.col}>
                            Account Name:
                        </div>
                        <div className={style.col2}>
                            {account?.account_name}
                        </div>
                    </div>
                    <div className={style.details}>
                        <div className={style.col}>
                        Bank Name:
                        </div>
                        <div className={style.col2}>
                            {account?.bank_name}
                        </div>
                    </div>
                    <div className={style.details}>
                        <div className={style.col}>
                            Account Number:
                        </div>
                        <div className={style.col2}>
                            <div 
                                style={{
                                        padding: "2px", 
                                        fontSize: "12px", 
                                        fontWeight: "600", 
                                        border: "1px solid", 
                                        borderRadius: "5px", 
                                        color: "grey", 
                                        marginRight: "5px"
                                    }}

                                    onClick={() => {
                                        if (account?.account_number) {
                                            navigator.clipboard.writeText(account.account_number);
                                            setCopied(true);
                                        }
                                    }}
                                        >
                                            {copied ? "COPIED" : "COPY!"}
                                        </div>
                            {account?.account_number}
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonModal>
    )
}

export default AccountDetailsModal;