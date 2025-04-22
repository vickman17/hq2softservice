import React, { useEffect, useState } from "react";
import { IonModal } from "@ionic/react";
import style from "./JobDetails.module.css";
import RatingComponent from "./RatingComponent";
import CloseModal from "./CloseModal";
import loader from "/assets/loader.gif";
interface JobProps {
  isJobModalOpen: boolean;
  onClose: () => void;
  jobId: string;
}

interface JobDetails {
  skill: string;
  address: string;
  local_government: string;
  state: string;
  additional_details: string;
  client_firstName?: string;
  client_lastName?: string;
  images?: string; // JSON stringified array
  proof_file?: string;
  status?: string;
  urgency?: string;
}

const API_BASE_URL = "http://localhost/hq2ClientApi"; // Make sure this is correct

const JobDetails: React.FC<JobProps> = ({ isJobModalOpen, onClose, jobId }) => {
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const userDetails = sessionStorage.getItem("userInfo");
  const parsedData = userDetails ? JSON.parse(userDetails) : null;
  const email = parsedData?.email || "ghost@example.com";
  const userId = parsedData?.user_id || "guest";


  const handleRatingSubmit = (rating: number, feedback: string) => {
    fetch("http://localhost/hq2ClientApi/saveRating.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, jobId, rating, feedback }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };



  useEffect(() => {
    if (isJobModalOpen) {
      fetchJobDetails();
    }
  }, [isJobModalOpen, jobId]);

  const fetchJobDetails = async () => {
    try {
      const response = await fetch("http://localhost/hq2ClientApi/getJobDetails.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const data = await response.json();
      
      // Check if jobDetails is an array and extract the first object
      if (Array.isArray(data.jobDetails)) {
        setJobDetails(data.jobDetails[0]); // Get the first object in the array
      } else {
        setJobDetails(data.jobDetails);
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };
  

  if (!jobDetails) return <IonModal isOpen={isJobModalOpen}><div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100vh"}}><img src={loader} width={30} /></div></IonModal>;

  // Parse images from JSON string to an array
  let imageUrls: string[] = [];
  try {
    imageUrls = jobDetails.images ? JSON.parse(jobDetails.images) : [];
  } catch (error) {
    console.error("Error parsing images:", error);
  }

  return (
    <IonModal isOpen={isJobModalOpen} className={style.modal} onDidDismiss={onClose}>
      <div onClick={onClose}>
        <CloseModal title="" color="black" />
      </div>
      <div className={style.modalContainer}>
        <div className={style.topHead}>
          <div className={style.skill}>{jobDetails.skill}</div>
          <div style={{color: jobDetails.status === "processing" ? "grey" : "var(--ion-company-gold)", fontSize: "15px"}} className={style.status}>{jobDetails.status}</div>
        </div>
        {/* Display images */}
        {imageUrls.length > 0 ? (
          <div>
          <div className={style.head}>Reference image(s)</div>
          <div className={style.imageGallery}>
            {imageUrls.map((image, index) => (
              <img
                key={index}
                src={`${API_BASE_URL}/${image.replace(/\\/g, "/")}`} // Fix backslashes
                alt={`Job Image ${index + 1}`}
                className={style.imageThumb}
                onClick={() => setSelectedImage(`${API_BASE_URL}/${image.replace(/\\/g, "/")}`)}
                onError={(e) => console.error("Image failed to load:", (e.target as HTMLImageElement).src)}
              />
            ))}
          </div>
          </div>
        ) : (
          <p>No images available</p>
        )}

        <fieldset className={style.field}>
          <legend className={style.head}>Address</legend>
          <p><strong>State:</strong> {jobDetails.state}</p>
          <p><strong>L.G.A:</strong> {jobDetails.local_government}</p>
          <p><strong>Address:</strong> {jobDetails.address}</p>
        </fieldset>

        <fieldset className={style.field}>
          <legend className={style.head}>Additional Details</legend>
          <p>{jobDetails.additional_details}</p>
        </fieldset>

        <fieldset className={style.field}>
          <legend className={style.head}>Job Status</legend>
          <p><strong>Status:</strong> {jobDetails.status}</p>
          <p><strong>Urgency:</strong> {jobDetails.urgency}</p>
        </fieldset>

        <RatingComponent userId={userId} jobId={jobId} onSubmit={handleRatingSubmit} />
      </div>

      {/* Full-screen Image Preview */}
      <IonModal isOpen={!!selectedImage} onDidDismiss={() => setSelectedImage(null)}>
        {selectedImage && (
          <div className={style.fullscreenContainer}>
            <div>x</div>
            <img src={selectedImage} alt="Full Preview" className={style.fullscreenImage} />
            <button className={style.closeButton} onClick={() => setSelectedImage(null)}>Close</button>
          </div>
        )}
      </IonModal>
    </IonModal>
  );
};

export default JobDetails;
