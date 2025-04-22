import React, { useEffect, useState } from 'react';
import { IonImg } from "@ionic/react";
import pro from './ProfilePics.module.css';

const ProfilePics: React.FC = () => {
    const userInfo = sessionStorage.getItem("userInfo");
    const parse = JSON.parse(userInfo || '{}');
    const userId = parse.id;
  const fallback = '/assets/blueplace.jpg';
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [mimeType, setMimeType] = useState<string | null>(null);

    useEffect(() => {
        // Fetch profile image on component mount
        const fetchProfileImage = async () => {
          try {
            const response = await fetch(`http://localhost/hq2ClientApi/getProfile.php?userId=${userId}`);
            const data = await response.json();
    
            if (data.status === "success") {
              // Set the MIME type and base64 image string as the source
              setProfileImage(data.profile_picture);
              setMimeType(data.mime_type); // The MIME type of the image (e.g., image/png, image/jpeg)
            } else {
              console.error("Error fetching profile picture:", data.message);
            }
          } catch (error) {
            console.error("Error fetching profile picture:", error);
          }
        };
    
        if (userId) {
          fetchProfileImage();
        }
      }, [userId]);

    return (
        <div className={pro.profile}>
            {profileImage && mimeType ? (
              <img className={pro.img} src={`data:${mimeType};base64,${profileImage}`} />
            ) : (
              <img className={pro.img} src={fallback} />
            )}
        </div>
    );
}

export default ProfilePics;
