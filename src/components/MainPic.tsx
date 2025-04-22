import React, { useEffect, useState } from "react";
import style from "./MainPic.module.css";
import axios from "axios";

const MainPic: React.FC = () => {
    const [profilePicture, setProfilePicture] = useState<string | null>(null);

    const storedInfo = sessionStorage.getItem("userInfo");
    const info = storedInfo ? JSON.parse(storedInfo) : {};
    const userId = info?.id;
    const place = "/assets/goldplace.jpg";  // Default image

    useEffect(() => {
        const fetchProfilePicture = async () => {
            try {
                const response = await axios.get('http://localhost/hq2ClientApi/getProfile.php', {
                    params: { user_id: userId }, // Replace with actual user ID
                });

                if (response.data.success && response.data.profile_picture) {
                    setProfilePicture('http://localhost/hq2ClientAPi/' + response.data.profile_picture);
                } else {
                    setProfilePicture(null); // No profile picture, fallback to default
                }
            } catch (error) {
                console.error('Error fetching profile picture:', error);
                setProfilePicture(null); // Fallback in case of error
            }
        };

        if (userId) {
            fetchProfilePicture();
        }
    }, [userId]);

    return (
        <div className={style.profile}>
            <div>
                <img 
                    className={style.img} 
                    src={profilePicture || place}  // Use place image if profilePicture is null or empty
                    alt="Profile" // Adding alt text for accessibility
                />
            </div>
        </div>
    );
};

export default MainPic;
