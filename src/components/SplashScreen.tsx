import { IonContent, IonPage, IonLoading } from "@ionic/react";
import React from "react";
import style from "./SplashScreen.module.css"

const SplashScreen: React.FC = () => {

const splash = "/assets/Icon.gif"

    return(
      <IonPage className={style.page}>
        <IonContent className={style.content}>
            <div className={style.splashCont}>
                <img src={splash} />
                <IonLoading/>
            </div>
        </IonContent>
      </IonPage>
    )
}


export default SplashScreen;