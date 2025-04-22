import { createChatRoom } from '../services/ChatServices';
import { IonContent, IonModal, IonButton, IonHeader, IonPage, IonDatetime, IonInput, IonItem, IonLabel, IonToast } from "@ionic/react";
import React from "react";
import { useState, useEffect, useRef } from "react";
import styles from "./JobRequestModal.module.css";
import { useHistory } from "react-router";
import CloseModal from './CloseModal';
import {modalController} from "@ionic/core";

interface JobRequestModalProps {
  isOpen: boolean;
  selectedSubcategory: { subcategory_name: string } | null;
  selectedCategory: { category_name: string } | null;
  onClose: () => void;
  Login: ()=> void;
}

const JobRequestModal: React.FC<JobRequestModalProps> = ({isOpen, selectedSubcategory, selectedCategory, Login, onClose }) => {


    const [showModal, setShowModal] = useState(false);
          const [showJobRequestModal, setShowJobRequestModal] = useState(false);
          const userDetails = sessionStorage.getItem('userInfo');
          const parsedData = userDetails ? JSON.parse(userDetails) : null;
          const userId = parsedData?.user_id;
          const firstName = parsedData?.firstName || "Hello";
          const lastName = parsedData?.lastName || "Guest";
          const [loader, setLoader] = useState<boolean>(false);    
          const [address, setAddress] = useState<string>('');
          const [additionalDetails, setAdditionalDetails] = useState<string>('');
          const [images, setImages] = useState<FileList | null>(null);
          const [selectedDate, setSelectedDate] = useState<string>("");
          const [showPicker, setShowPicker] = useState(false);
          const [selectedImages, setSelectedImages] = useState<File[]>([]);
          const [submitting, setSubmitting] = useState<boolean>(false);     
          const [showToast, setShowToast] = useState<boolean>(false);
          const [toastText, setToastText] = useState<string>('');
          const [openSuccess, setOpenSuccess] = useState<boolean>(false);

          const maxImages = 6; // Maximum number of images allowed
          const fileInputRef = useRef<HTMLInputElement>(null);

          const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files) {
              const filesArray = Array.from(event.target.files);
        
              if (selectedImages.length + filesArray.length > maxImages) {
                setToastText(`You can only upload up to ${maxImages} images.`);
                setShowToast(true)
                return;
              }
        
              setSelectedImages((prevImages) => [...prevImages, ...filesArray]);
            }
          };
        
          const removeImage = (index: number) => {
            setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
          };


          const handleDateChange = (e: CustomEvent) => {
            const fullDate = e.detail.value as string;
            if (fullDate) {
              const formattedDate = new Date(fullDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              setSelectedDate(formattedDate);
            }
            setShowPicker(false);
          };

        
    const history = useHistory();

    const handleCreateChat = async (jobId: string, adminId: string, userId: string) => {
        try {
          const chatRoomId = await createChatRoom(jobId, adminId, userId);
          console.log(`Created chat room with ID: ${chatRoomId}`);
          return chatRoomId; // Return the chat room ID for further use
        } catch (error) {
          console.error('Error creating chat room:', error);
          throw error; // Re-throw the error to handle it in the calling function
        }
      };
    
    
    

      const handleSubmitJobRequest = async (event: React.FormEvent) => {
        event.preventDefault();
      
        setSubmitting(true)

        if (!additionalDetails || !address) {
          setToastText("Please fill in address and additional details fields");
          setShowToast(true)
          setSubmitting(false);
          return;
        }
      
        if (selectedImages.length === 0) {
          setToastText("Please upload at least one image");
          setShowToast(true);
          return;
        }
      
        // Convert images to Base64
        const convertImagesToBase64 = async (files: File[]) => {
          const promises = files.map((file) => {
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = () => reject(reader.error);
              reader.readAsDataURL(file);
            });
          });
          return Promise.all(promises);
        };
      
        try {

          if (!proofFile) {
            setToastText("Please upload a proof file.");
            setShowToast(true)
            return;
          }

          const base64Images = await convertImagesToBase64(selectedImages);
          const base64Proof = await convertFileToBase64(proofFile);

          // Create JSON payload
          const payload = {
            userId,
            address,
            selectedState,
            selectedLga,
            skill: selectedSubcategory?.subcategory_name,
            urgency: selectedUrgency,
            additionalDetails,
            images: base64Images,
            proofFile: base64Proof, // Send all selected images as Base64
          };
      
          const response = await fetch("http://localhost/hq2ClientApi/saveJobRequest.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
      
          if (!response.ok) {
            throw new Error("Failed to save job request");
          }
      
          const responseData = await response.json();

          if(responseData.success){
            console.log("Job request saved successfully:", responseData);
            setOpenSuccess(true)
  
          }
      
          // Fetch supervisors by profession
          // const supervisorsResponse = await fetch(
          //   `http://localhost/hq2ClientApi/supervisors.php?profession=${encodeURIComponent(selectedCategory?.category_name || "")}`,
          //   { method: "GET" }
          // );
      
          // if (!supervisorsResponse.ok) {
          //   throw new Error("Failed to fetch supervisors");
          // }
      
          // const supervisors = await supervisorsResponse.json();
      
          // if (!Array.isArray(supervisors) || supervisors.length === 0) {
          //   throw new Error("No supervisors available for the selected category");
          // }
      
          // // Randomly select a supervisor
          // const randomSupervisor = supervisors[Math.floor(Math.random() * supervisors.length)];
          // const adminId = randomSupervisor.id.toString();
      
          // // Create a chat room with the job ID, admin ID, and user ID
          // await handleCreateChat(responseData.jobId, adminId, userId);
      
          // // Redirect to the chat room
          // history.push(`/chat/${responseData.jobId}`);
      
        } catch (error) {
          console.error("Error saving job request or fetching supervisors:", error);
          alert("An error occurred. Please try again.");
        }finally{
          setSubmitting(false);
        }
      };
      

  const closeJobRequestModal = () => {
    setShowJobRequestModal(false);
  };

  const [states, setStates] = useState<string[]>([]); // Stores list of states
  const [lgas, setLgas] = useState<string[]>([]); // Stores list of LGAs for residential
  
  
  const [selectedState, setSelectedState] = useState<string>(''); // Stores selected state (residential)
  const [selectedLga, setSelectedLga] = useState<string>(''); // Stores selected LGA (residential)
  
  const [loadingStates, setLoadingStates] = useState<boolean>(true); // State for states loading
  const [loadingLgas, setLoadingLgas] = useState<boolean>(false); // State for LGAs loading (residential)
  const [loadingWorkLgas, setLoadingWorkLgas] = useState<boolean>(false); // State for work LGAs loading
  
  // Fetch states from API
  const getStatesFromApi = async () => {
    try {
      const response = await fetch('https://nga-states-lga.onrender.com/fetch');
      const json = await response.json();
      return json || []; // Ensure empty array if no states
    } catch (error) {
    //   setToast(true)
    //   setToastText('Check your internet connection!');
      return []; // Return an empty array in case of error
    }
  };
  
  // Fetch all states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      const states = await getStatesFromApi();
      setStates(states); // Set the states
      console.log(states)
      setLoadingStates(false); // Stop the loading indicator
    };
  
    fetchStates();
  }, []);
  
  // Fetch LGAs for residential address when a state is selected
  useEffect(() => {
    if (selectedState) {
      const fetchLgas = async () => {
        setLoadingLgas(true); // Start loading indicator for residential LGAs
        try {
          const response = await fetch(`https://nga-states-lga.onrender.com/?state=${selectedState}`);
          const json = await response.json();
          setLgas(json || []); // Ensure empty array if no LGAs
        } catch (error) {
        //   setToast(true)
        //   setToastText('Check your internet connection!');
          setLgas([]); // Ensure empty array if error occurs
        } finally {
          setLoadingLgas(false); // Stop the loading indicator for residential LGAs
        }
      };
  
      fetchLgas();
    } else {
      setLgas([]); // Clear LGAs when no state is selected for residential address
    }
  }, [selectedState]);
  
    // Find the category that conta

    console.log(selectedSubcategory);

     const [selectedTime, setSelectedTime] = useState<string>("");
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleTimeChange = (e: CustomEvent) => {
    const fullTime = e.detail.value as string;
    if (fullTime) {
      const formattedTime = new Date(fullTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // Formats as AM/PM
      });
      setSelectedTime(formattedTime);
    }
    setShowPicker(false);
  };

  
  const [selectedUrgency, setSelectedUrgency] = useState<string>("");




const [proofFile, setProofFile] = useState<File | null>(null);
const [proofPreview, setProofPreview] = useState<string | null>(null);

const handleProofChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    setProofFile(file);

    if (file.type.startsWith("image/")) {
      // Show image preview
      setProofPreview(URL.createObjectURL(file));
    } else if (file.type === "application/pdf") {
      // Show filename for PDFs
      setProofPreview(file.name);
    } else {
      alert("Please upload a valid image or PDF file.");
      event.target.value = ""; // Reset file input
    }
  }
};

// Convert proof file to Base64
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};





    return(
    <IonModal
        isOpen={isOpen}
        onDidDismiss={onClose}
        >
          
        <div onClick={onClose} style={{border: "0px solid black", width: "fit-content", paddingTop: "10px"}}>
            <CloseModal title="" color="black" />
        </div>
        {userId ? 
        <IonContent>
          <div className={styles.modalContent}>
            <div className={styles.modalHead}>
              Request for <span style={{color:"var(--ion-company-gold)"}}>{selectedSubcategory ? selectedSubcategory.subcategory_name : null}</span>
            </div>
            <div style={{border: "0px solid", marginTop: "1rem"}}>
            <div className={styles.formGroup}>
              <div className={styles.head}>Preffered Location</div>
              <select
                  id="state"
                  value={selectedState}
                  className={styles.input}
                  onChange={(e) => setSelectedState(e.target.value)}
              >
                  <option value="" hidden>--Choose a State--</option>
                  {loadingStates ? (
                  <option disabled>Loading States...</option>
                  ) : (
                  states.length > 0 ? (
                      states.map((state, index) => (
                      <option key={index} value={state}>{state}</option>
                      ))
                  ) : (
                      <option disabled>No states available</option>
                  )
                  )}
              </select>
              </div>

              <div className={styles.formGroup}>
              <select className={styles.input} id="lga"
                  disabled={!selectedState || loadingLgas}
                  onChange={(e) => setSelectedLga(e.target.value)}>
                  <option value="" hidden>--Choose an LGA--</option>
                  {loadingLgas ? (
                  <option disabled>Loading LGAs...</option>
                  ) : (
                  lgas.length > 0 ? (
                      lgas.map((lga, index) => (
                      <option key={index} value={lga}>{lga}</option>
                      ))
                  ) : (
                      <option disabled>No LGAs available</option>
                  )
                  )}
              </select>

              </div>

              <fieldset className={styles.input}>
                <legend>House No & Street Address</legend>
                  <input
                 value={address}
                 style={{background: "transparent", fontSize: "17px", width: "100%", border: "none", outline: "none"}}
                  onChange={(e) => setAddress(e.target.value!)}
                  placeholder="Enter your address"
                  />
              </fieldset>


              <div className={styles.formGroup}>
               <div className={styles.head}>
                Urgency
               </div>
              <select className={styles.input} id="lga"
                  onChange={(e) => setSelectedUrgency(e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
              </select>
              </div>

              <div>
                <div className={styles.head}>Date & Time</div>
                <div style={{display: "flex", border: "0px solid", justifyContent: "space-between", alignItems: "center"}}>
                    <div className={styles.time}>
          <input 
          type="text" 
          value={selectedDate} 
          readOnly 
          placeholder="Set Date"
          onClick={() => setShowPicker(true)}
          style={{ width: "100%", cursor: "pointer", background: "transparent", border: "none", outline: "none", textAlign: "center" }}
        />

                    </div>
                    <div className={styles.time}>
                         <input 
                              type="text" 
                              value={selectedTime} 
                              readOnly 
                              placeholder="Select Time"
                              onClick={() => setShowTimePicker(true)}
                              style={{ width: "100%", cursor: "pointer", background: "transparent", border: "none", outline: "none", textAlign: "center" }}
                             />
                    </div>
                </div>
              </div>

              </div>
              <div style={{marginTop: "10px"}}>
                <div className={styles.head}>Additional Information</div>
            <fieldset style={{padding: "0", paddingInline: "5px", borderRadius: "5px", border: "1px solid grey"}}>
                <textarea
                className={styles.textArea}
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value!)}
                placeholder="Provide additional details if necessary"
                />
            </fieldset>
            </div>
            <div style={{marginTop: "1rem", border: "0px solid"}}>
            <div>
              <div className={styles.head}>
                Reference Image(s)
              </div>
            <div>
      {/* Hidden File Input */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />

      <div
        id="imgCont"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        {[...Array(maxImages)].map((_, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              width: "100px",
              height: "100px",
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              border: "2px dashed #ccc",
            }}

            onClick={() => {
              if (!selectedImages[index] && fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
          >
            {selectedImages[index] ? (
              <>
                <img
                  src={URL.createObjectURL(selectedImages[index])}
                  alt={`preview-${index}`}
                  style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the file input
                    removeImage(index);
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: "red",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    fontSize: "12px",
                    lineHeight: "20px",
                    textAlign: "center",
                  }}
                >
                  X
                </button>
              </>
            ) : (
              <span style={{ color: "#888" }}>+</span> // Placeholder
            )}
          </div>
        ))}
      </div>
      <div>
        <div className={styles.head}>Proof of Address or Ownership</div>
        <div style={{ marginTop: "-4px", textAlign: "left", fontSize: "10px", color: "#555" }}>Upload PDF, IMG*</div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
    
    {/* Hidden file input */}
    <input
      type="file"
      accept="image/*,application/pdf"
      onChange={handleProofChange}
      id="proofUpload"
      style={{ display: "none" }}
    />

    {/* Clickable box to trigger file input */}
    <div
      onClick={() => document.getElementById("proofUpload")?.click()}
      style={{
        width: "150px",
        height: "150px",
        border: "2px dashed #ccc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        position: "relative",
      }}
    >
      {proofPreview ? (
        proofFile?.type.startsWith("image/") ? (
          <img
            src={proofPreview}
            alt="Proof Preview"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
          />
        ) : (
          <p style={{ textAlign: "center", padding: "10px" }}>{proofFile?.name}</p>
        )
      ) : (
        <span style={{ fontSize: "24px", color: "#888" }}>+</span>
      )}
    </div>

    {/* Privacy notice */}
    <div style={{ marginTop: "10px", textAlign: "center", fontSize: "14px", color: "#555" }}>
      We value your privacy—your proof of address is only used for verification and is not stored after the process is complete.
    </div>
  </div>
       </div>
      </div>

            </div>

            <button onClick={handleSubmitJobRequest} type="submit" style={{width: "100%", background: "var(--ion-company-wood)", fontWeight: "600", marginTop: "15px", paddingBlock: "12px", fontSize: "18px", borderRadius: "10px", marginBottom: "10px", color: "white"}}>
                Order Service
            </button>
            </div>
            </div>
            
            </IonContent>
            :  <div style={{border: "0px solid black", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "700"}}>
                Please <span onClick={Login} style={{color: "var(--ion-company-gold)", textDecoration: "underline"}}> &nbsp;Login&nbsp; </span> to continue using our service
              </div>}
                {/* Date Picker Modal */}
                <IonModal isOpen={showPicker} onDidDismiss={() => setShowPicker(false)}>
          <IonDatetime 
            presentation="date"
            value={selectedDate}
            onIonChange={handleDateChange}
          />
          <IonButton expand="full" onClick={() => setShowTimePicker(false)}>Set Date</IonButton>
        </IonModal>
                {/* Time Picker Modal */}
        <IonModal isOpen={showTimePicker} onDidDismiss={() => setShowPicker(false)}>
          <div style={{border: "1px solid black", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <IonDatetime 
              presentation="time"
              value={selectedTime}
              onIonChange={handleTimeChange}
            />
          </div>
          <IonButton expand="full" onClick={() => setShowTimePicker(false)}>Set Time</IonButton>
        </IonModal>

        <IonModal isOpen={submitting} onDidDismiss={()=>setSubmitting(false)}>
          <IonContent>
            Submitting
          </IonContent>
        </IonModal>
        


        <IonModal isOpen={openSuccess} onDidDismiss={()=>setOpenSuccess(false)}>
          Job Request Successful
        </IonModal>
        </IonModal>

    )
}

export default JobRequestModal;