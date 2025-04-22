import React, {useEffect} from "react";
import { IonPage, IonHeader, IonContent, IonButton } from "@ionic/react";
import Back from "../components/Back";


const Security: React.FC = () =>{
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      }, []);

    return(
        <IonPage>
            <IonHeader>
                <Back/>
                <p>Login & Security</p>
            </IonHeader>
            <IonContent>
                <div>
                    <IonButton>Change Password</IonButton>
                    <IonButton>
                        Delete Account
                    </IonButton>
                    <IonButton>Deactivate Account</IonButton>
                </div>

            </IonContent>
        </IonPage>
    )
}

export default Security;