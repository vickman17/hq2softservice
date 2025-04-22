import React from "react";
import { IonHeader } from "@ionic/react";
import Back from "./Back";
import style from "./Header.module.css";

// Define the props interface
interface HeaderProps {
  title: string; // Title to display in the header
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <IonHeader className={style.header}>
      <div className={style.head}>
        <div>
          <Back />
        </div>
        <div className={style.title}>
          {title}
        </div>
      </div>
    </IonHeader>
  );
};

export default Header;
