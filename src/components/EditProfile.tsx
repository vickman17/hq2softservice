import React, { useEffect, useState, useRef } from "react";
import style from "./EditProfile.module.css";
import { IonPage, IonHeader, IonContent, IonIcon, IonButton, IonToast, IonLoading, IonModal } from "@ionic/react";
import Back from "../components/Back";
import { camera } from "ionicons/icons";
import MainPic from "../components/MainPic";
import CloseModal from "./CloseModal";
import axios from "axios";

interface EditProps{
    isOpen: boolean;
    onClose: ()=>void;
}


const EditProfile: React.FC<EditProps> = ({isOpen, onClose}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = sessionStorage.getItem("userInfo");
  const parsedData = user ? JSON.parse(user) : {};
  const [firstName, setFirstName] = useState(parsedData.firstName || "First Name");
  const [lastName, setLastName] = useState(parsedData.lastName || "Last Name");
  const [email, setEmail] = useState(parsedData.email || "Email");
  const [phoneNumber, setPhoneNumber] = useState(parsedData.phoneNumber || "Phone Number");
  const userId = parsedData.user_id;
  const [toastActive, setToastActive] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const [loadText, setLoadText] = useState<string>("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  const handleOpenFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically open the file input dialog
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('profile_image', file);
        formData.append('user_id', userId); 

        try {
            const response = await axios.post('http://localhost/hq2clientApi/uploadProfile.php', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                alert('Profile image uploaded successfully!');
                console.log('Image Path:', response.data.path);
            } else {
                alert('Upload failed: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('An error occurred while uploading the file.');
        }
    }
};


  const handleUpload = async () => {
    const profileData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      userId,
    };

    try {
      const response = await fetch("http://localhost/hq2ClientApi/uploadImage.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (data.status === "success") {
        setToastActive(true);
        setToastText("Profile details updated successfully!");
      } else {
        setToastActive(true);
        setToastText("Failed to update profile: " + data.message);
      }
    } catch (error) {
        setToastActive(true)
      console.error("Error updating profile:", error);
      setToastText("Error updating profile details");
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <div onClick={onClose} style={{ boxShadow: "none" }}>
        <CloseModal title="" color="black"/>
      </div>
      <IonContent>
        <div className={style.imgBox}>
          <div className={style.pic}>
            <MainPic />
            <div style={{fontSize: "13px", color: "grey"}} onClick={handleOpenFilePicker}>Click to change profile photo</div>
          </div>
          <div className={style.add}>
            {/* Hidden File Input */}
            <input
              type="file"
              accept="images/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {/* Icon to Open File Input */}
            {/* <IonIcon onClick={handleOpenFilePicker} icon={camera} /> */}
          </div>
        </div>
        <div className={style.sectionTwo}>
          <div className={style.table}>
            <div className={style.head}>First Name</div>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={style.editInput}
            />
          </div>
          <div className={style.table}>
            <div className={style.head}>Last Name</div>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={style.editInput}
            />
          </div>
          
          <div className={style.table}>
            <div className={style.head}>Phone Number</div>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={style.editInput}
            />
          </div>
        </div>
        <div className={style.submit}>
          <IonButton onClick={handleUpload} className={style.button}>
            Save
          </IonButton>
        </div>
        <IonToast isOpen={toastActive} message={toastText} duration={5000}/>
        <IonLoading className="custom-loading" isOpen={loader} message={loadText}  />
      </IonContent>
    </IonModal>
  );
};

export default EditProfile;
