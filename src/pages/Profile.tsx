import { IonContent, IonIcon, IonPage } from "@ionic/react";
import {shieldCheckmarkOutline, personOutline, handLeft, handLeftOutline, homeOutline, exitOutline, logOutOutline} from "ionicons/icons"
import style from "./style/Profile.module.css";
import BottomNav from "../components/BottomNav";
import React, {useEffect, useState} from "react";
import { shieldCheckmark } from "ionicons/icons";
import MainPic from "../components/MainPic";
import EditProfile from "../components/EditProfile";
import {useHistory} from "react-router-dom";
import about from "/assets/svg/info.svg";
import key from "/assets/svg/key.svg";
import logout from "/assets/svg/logout.svg";
import support from "/assets/svg/support.svg";

const capitalizeFirstLetter = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};



const Profile: React.FC=()=>{
 const userInfoString = sessionStorage.getItem("userInfo");
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const [editModal, setEditModal] = useState<boolean>(false);

  // Access properties with fallback in case userInfo is null
  const firstName = userInfo?.firstName || "Hello";
  const lastName = userInfo?.lastName || "Guest";
  const email = userInfo?.email || "";

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      }, []);

      const history = useHistory();


      const logoutFunc = () => {
        sessionStorage.clear()
        localStorage.removeItem("userInfo")
        history.push("/home")
      }

    return(
        <IonPage>
            <IonContent>
              <div>
                <div>
                  <MainPic/>
                </div>
                <div style={{textAlign: "center", fontWeight: "800", color: "var(--ion-company-wood)", fontSize: "22px", marginTop: "15px"}}>
                  {capitalizeFirstLetter(firstName)} {capitalizeFirstLetter(lastName)}
                </div>
                <div style={{textAlign: "center", fontSize: "13px", color: "grey", marginTop: "5px"}}>
                  {email}
                </div>
              </div>

              {userInfo ?
              <div onClick={()=>setEditModal(true)} style={{width: "fit-content", margin: "auto", marginTop: "1rem", border:"0px solid black", fontSize: "19px", fontWeight: "800", padding: "10px", borderRadius: "1.3rem", background: "var(--ion-company-wood)", color: "white"}}>
                Edit Profile
              </div>
              : ""}
              
              <div style={{margin: "auto", border:"0px solid black", marginTop: "2.5rem", width: "95%", borderRadius: "15px", background: "#4f794227"}}>
                <div className={style.item}>
                    <div className={style.icon}><img src={about} width={15} /></div>
                    <div>About</div>
                </div>
                <div className={style.item}>
                  <div className={style.icon}><img src={support} width={15} /></div>
                    <div>Support</div>
                </div>
                <div className={style.item}>
                <div className={style.icon}><img src={key} width={15} /></div>
                    <div>Change Password</div>
                </div>
                <div onClick={logoutFunc} style={{border: "none"}} className={style.item}>
                <div className={style.icon}><img src={logout} width={15} /></div>
                    <div>{userInfo ? "Logout" : "Login" }</div>
                </div>
              </div>
                
            </IonContent>
            <EditProfile isOpen={editModal} onClose={()=>setEditModal(false)} />
        </IonPage>
    )
}

export default Profile;