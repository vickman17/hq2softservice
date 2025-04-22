import { IonHeader, IonIcon, IonModal } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import React from "react";
import style from "./CloseModal.module.css";

interface closeProps{
    color: string;
    title: string
}

const CloseModal: React.FC<closeProps> = ({color, title}) => {

    return(
        <IonHeader className={style.header}>
            <div className={style.head}>
                <div style={{color: color, fontSize: "25px"}}>
                    <IonIcon icon={arrowBack} />
                </div>
                <div style={{color: color, fontSize: "18px", marginBottom: "5px"}}>
                    {title}
                </div>
            </div>
        </IonHeader>
    )
}

export default CloseModal;