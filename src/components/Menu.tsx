import { IonContent, IonHeader, IonItem, IonMenu, IonTitle, IonToolbar, IonRouterLink } from "@ionic/react";
import React from "react";
import menu from './Menu.module.css';
import Theme from './Theme';
import DarkMode from "./DarkMode";
import Logout from "./Logout";
import { useUser } from "../hooks/UserContext"; // Import useUser
import { useHistory } from "react-router-dom";

interface MenuProps {
  contentId: string;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

const Menu: React.FC<MenuProps> = ({ contentId, onMenuOpen, onMenuClose }) => {
  const { userInfo } = useUser(); // Access userInfo from useUser
  const user = sessionStorage.getItem("userInfo");
  const parsedData = user ? JSON.parse(user) : null; // Handle null case for user
  const firstName = parsedData?.firstName || "Guest"; // Fallback to "Guest" if undefined
  const lastName = parsedData?.lastName || ""; // Fallback to an empty string if undefined
  const history = useHistory();
  const fallback = '/assets/blueplace.jpg';


    return (
        <IonMenu contentId={contentId} onIonDidOpen={onMenuOpen} onIonDidClose={onMenuClose}>
            <IonHeader style={{ display: "flex", height: "20%", border: "0px solid black" }}>
                <div className={menu.menuImg} style={{ height: "100%", width: "40%" }}>
                    <img src={fallback} style={{ width: "100%", height: "100%" }}  />
                </div>
                <div style={{ padding: "5px", width: "60%" }} className={menu.menuheader}>
                    <div style={{ border: "0px solid black", width: "fit-content", marginLeft: "auto" }}>
                        <Theme />
                    </div>
                    <div style={{ border: "0px solid black", marginTop: "2rem", width: "95%", margin: "auto", textAlign: "left" }}>
                        <h1 className={menu.name} style={{ margin: "auto" }}>{firstName} {lastName}</h1>
                    </div>
                </div>
            </IonHeader>
            <IonContent className={menu.menulist} style={{ height: "100vh", paddingTop: "2rem" }}>
                <div style={{ borderBottom: "0px solid black", width: "95%", margin: "auto", paddingBottom: "0.5rem", paddingTop:"2rem" }}>
                    <IonItem onClick={()=>history.push('/notification')} style={{ '--background': "transparent" }}>
                        <h1>NOTIFICATION</h1>
                    </IonItem>
                </div>
                <div style={{ borderBottom: "0px solid black", width: "95%", margin: "auto", paddingTop: "2rem", paddingBottom: "0.5rem" }}>
                    <IonItem onClick={()=>history.push('/services')} style={{ '--background': "transparent" }}>
                        <h1>SERVICES</h1>
                    </IonItem>
                </div>
                <div style={{ borderBottom: "0px solid black", width: "95%", margin: "auto", paddingTop: "2rem", paddingBottom: "0.5rem" }}>
                    <IonItem onClick={()=>history.push('/inbox')} style={{ '--background': "transparent" }}>
                        <h1>INBOX</h1>
                    </IonItem>
                </div>
                <div style={{ borderBottom: "0px solid black", width: "95%", margin: "auto", paddingTop: "2rem", paddingBottom: "0.5rem" }}>
                    <IonItem onClick={()=>history.push('/profile')} style={{ '--background': "transparent" }}>
                        <h1>SETTINGS</h1>
                    </IonItem>
                </div>
                <div>
                    <Logout/>
                </div>
            </IonContent>
        </IonMenu>
    );
};

export default Menu;
