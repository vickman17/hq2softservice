import { IonContent, IonHeader, IonPage, IonLabel, IonSegment, IonSegmentButton, IonBreadcrumb } from "@ionic/react";
import React, { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import style from "./style/Jobs.module.css";
import CancelledJobs from "../components/CancelledJobs";
import PendingJobs from "../components/PendingJobs";
import CompletedJobs from "../components/CompletedJobs";
import Back from '../components/Back';
import CloseModal from "../components/CloseModal";
import { useHistory } from "react-router";

const Jobs: React.FC = () => {
  const userDetails = sessionStorage.getItem("userInfo");
  const parsedData = userDetails ? JSON.parse(userDetails) : null;
  const email = parsedData?.email || "ghost@example.com";
  const userId = parsedData?.user_id || "guest";
  const history = useHistory();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);
  const [selectedSegment, setSelectedSegment] = useState<string>('Completed');
  const [segmentColor, setSegmentColor] = useState<string>("");

  const handleSegmentChange = (event: CustomEvent) => {
    setSelectedSegment(event.detail.value);
  };

  const renderSegmentContent = () => {
    switch (selectedSegment) {
      case 'Completed':
        return <CompletedJobs/>;
      case 'Pending':
        return <PendingJobs/>;
      default:
        return null;
    }
  };




  return (
    <IonPage style={{background: "white"}}>
      <div style={{fontSize: "32px", border: "0px solid",  color: "var(--ion-company-wood)", fontWeight: "800", width: "95%", margin: "auto", marginTop: ".5rem"}}>Jobs</div>
        <IonSegment className={style.segment} onIonChange={handleSegmentChange} value={selectedSegment} mode="ios" >
          <IonSegmentButton className={style.segBut} value="Completed">
            <div style={{display: "flex", alignItems: "center"}}>Completed <IonBreadcrumb>#</IonBreadcrumb></div>
          </IonSegmentButton>
          <IonSegmentButton className={style.segBut}  value="Pending">
            <div>Ongoing</div>
          </IonSegmentButton>
        </IonSegment>
      <IonContent>
        {userDetails ? 
        <div style={{overflow: "scroll"}}>
          {renderSegmentContent()}
        </div>
            :  <div style={{border: "0px solid black", height: "80vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "700"}}>
                Please <span onClick={()=>history.push("/home")} style={{color: "var(--ion-company-gold)", textDecoration: "underline"}}> &nbsp;Login&nbsp; </span> to continue using our service
            </div>}
      </IonContent>
    </IonPage>
  );
};

export default Jobs;
