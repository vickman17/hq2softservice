import React, { ReactNode, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPage,
  IonIcon,
  IonModal,
  IonList,
  IonItem,
  IonSkeletonText,
  IonTextarea,
  IonButton,
  IonLabel,
} from '@ionic/react';
import style from './style/Services.module.css';
import { chevronBack, search } from 'ionicons/icons';
import BottomNav from '../components/BottomNav';
import Back from '../components/Back';
import '../theme/variables.css';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import { createChatRoom } from '../services/ChatServices';


interface Category {
  id: number;
  category_name: string;
  category_pics: string;
  supervisor_id: number;
}

interface Subcategory {
  id: number;
  subcategory_name: string;
}

interface RouteParams {
  serviceId?: string;
  subcategoryId?: string;
}

const fetchCategories = async (): Promise<Category[]> => {
  const url = 'http://localhost/hq2ClientApi/fetchCategory.php';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Services: React.FC = () => {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const [showModal, setShowModal] = useState(false);
  const [showJobRequestModal, setShowJobRequestModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(""); 
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [toast, setToast] = useState(false);
  const [toastText, setToastText] = useState("");
  const history = useHistory();

  const location = useLocation<{ serviceName?: string; subcategoryName?: string }>();
  const { serviceId, subcategoryId } = useParams<RouteParams>();
  const userDetails = sessionStorage.getItem('userInfo');
  const parsedData = userDetails ? JSON.parse(userDetails) : null;
  const userId = parsedData?.user_id;
  const [serviceName, setServiceName] = useState<string | null>(null);
  const [subcategoryName, setSubcategoryName] = useState<string | null>(null);
  const [loader, setLoader] = useState<boolean>(false);


  const [address, setAddress] = useState<string>('');
  const [additionalDetails, setAdditionalDetails] = useState<string>('');
  const [images, setImages] = useState<FileList | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    document.body.style.fontFamily = 'Varela Round, sans-serif';
    document.body.style.overflowX = 'hidden';
  }, []);

  useEffect(() => {
    if (location.state) {
      setServiceName(location.state.serviceName || null);
      setSubcategoryName(location.state.subcategoryName || null);
    } else if (serviceId && subcategoryId) {
      setServiceName(`Service ID: ${serviceId}`);
      setSubcategoryName(`Subcategory ID: ${subcategoryId}`);
    }
  }, [location, serviceId, subcategoryId]);



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





  const handleCategoryClick = async (category: Category) => {
    setShowModal(true);
    setSelectedCategory(category);
    setLoader(true);

    try {
      const response = await fetch(`http://localhost/hq2ClientApi/fetchSub.php?categoryId=${category.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch subcategories');
      }

      const responseBody = await response.text();
      console.log('Raw Response:', responseBody);
      if (!responseBody) {
        throw new Error('Response body is empty');
      }

      try {
        const subcategoriesData = JSON.parse(responseBody);
        setSubcategories(subcategoriesData);
        console.log(subcategoriesData);
      } catch (error) {
        throw new Error('Error parsing JSON: ' + error);
      }
      setLoader(false);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setLoader(false);
    }
  };

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    setShowJobRequestModal(true);
    setSelectedSubcategory(subcategory.subcategory_name);
    console.log(subcategory.subcategory_name)
    setShowModal(false);
  };

  const handleSubmitJobRequest = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (!additionalDetails) {
      alert('Please fill in address and additional details fields');
      return;
    }
  
    if (!images) {
      alert('Please upload at least one image');
      return;
    }
  
    // Convert images to base64 strings
    const convertImagesToBase64 = async (fileList: FileList) => {
      const promises = Array.from(fileList).map((file) => {
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
      const base64Images = await convertImagesToBase64(images);
  
      // Create JSON payload
      const payload = {
        userId,
        address,
        selectedState,
        selectedLga,
        skill: selectedSubcategory,
        additionalDetails,
        images: base64Images,
      };
  
      const response = await fetch('http://localhost/hq2ClientApi/saveJobRequest.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save job request');
      }
  
      const responseData = await response.json();
      console.log('Job request saved successfully:', responseData);
  
      // Fetch supervisors by profession
      const supervisorsResponse = await fetch(
        `http://localhost/hq2ClientApi/supervisors.php?profession=${encodeURIComponent(selectedCategory?.category_name || '')}`,
        {
          method: 'GET',
        }
      );
  
      if (!supervisorsResponse.ok) {
        throw new Error('Failed to fetch supervisors');
      }
  
      const supervisors = await supervisorsResponse.json();
  
      if (!Array.isArray(supervisors) || supervisors.length === 0) {
        throw new Error('No supervisors available for the selected category');
      }
  
      // Randomly select a supervisor
      const randomSupervisor = supervisors[Math.floor(Math.random() * supervisors.length)];
      const adminId = randomSupervisor.id.toString(); // Get the supervisor's ID
  
      // Create a chat room with the job ID, admin ID, and user ID
      await handleCreateChat(responseData.jobId, adminId, userId);
  
      // Redirect to the chat room or show a success message
      history.push(`/chat/${responseData.jobId}`); // Example: Redirect to the chat room
  
    } catch (error) {
      console.error('Error saving job request or fetching supervisors:', error);
      alert('An error occurred. Please try again.');
    }
  };
   
  const closeModal = () => {
    setShowModal(false);
  };

  const closeJobRequestModal = () => {
    setShowJobRequestModal(false);
  };


/***********************LOCATION API ***********************/

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
    setToast(true)
    setToastText('Check your internet connection!');
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
        setToast(true)
        setToastText('Check your internet connection!');
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



/***************************************************** */




  return (
    <IonPage className={style.page}>
      <IonHeader style={{ boxShadow: 'none', paddingBlock: '8px' }}>
        <Back />
        <div className={style.searchField}>
          <IonIcon icon={search} />
          <input type="text" placeholder="Search Services" className={style.input} />
        </div>
      </IonHeader>
      <IonContent>
        <div className={style.headerInfo}>
          {serviceName && <h2>{serviceName}</h2>}
          {subcategoryName && <h3>{subcategoryName}</h3>}
        </div>
        <div className={style.categoryGrid}>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className={style.categoryItem}>
                <IonSkeletonText animated style={{ width: '100%', height: '100%' }} />
              </div>
            ))
          ) : (
            Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category) => (
                <div
                  key={category.id}
                  className={style.categoryItem}
                  style={{
                    backgroundImage: `url(http://localhost/hq2ClientApi/${category.category_pics})`,
                  }}
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className={style.categoryName}>{category.category_name}</div>
                </div>
              ))
            ) : (
              <p>No categories found.</p>
            )
          )}
        </div>

        <IonModal className={style.partialModal} isOpen={showModal} onDidDismiss={closeModal}>
          <IonHeader className={style.modalHead}>
            <div className={style.searchField}>
              <IonIcon icon={search} />
              <input type="text" placeholder="Search Services" className={style.input} />
            </div>
          </IonHeader>
          <IonContent className={style.modal}>
            <IonList>
              {loader ? (
                <IonSkeletonText animated />
              ) : (
                Array.isArray(subcategories) && subcategories.length > 0 ? (
                  subcategories.map((subcategory) => (
                    <IonItem
                      key={subcategory.id}
                      button
                      onClick={() => handleSubcategoryClick(subcategory)}
                    >
                      <IonLabel>{subcategory.subcategory_name}</IonLabel>
                    </IonItem>
                  ))
                ) : (
                  <p>No subcategories found.</p>
                )
              )}
            </IonList>
          </IonContent>
        </IonModal>

        <IonModal
          isOpen={showJobRequestModal}
          onDidDismiss={closeJobRequestModal}
          className={style.modalContent}
        >
          <IonHeader className={style.modalHead}>
            <h2>Request for {selectedSubcategory} from {selectedCategory ? selectedCategory.category_name : 'Not Selected'}</h2>
          </IonHeader>
          <IonContent className={style.modalContent}>
            
              <div>
              <select
                 id="state"
                 value={selectedState}
                 className={style.input}
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

              <div>
              <select className={style.input} id="lga"
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

              <div className={style.formGroup}>
                <label>Address</label>
                <IonTextarea
                  value={address}
                  onIonChange={(e) => setAddress(e.detail.value!)}
                  placeholder="Enter your address"
                />
              </div>

              <div className={style.formGroup}>
                <label>Additional Details</label>
                <IonTextarea
                  value={additionalDetails}
                  onIonChange={(e) => setAdditionalDetails(e.detail.value!)}
                  placeholder="Provide additional details if necessary"
                />
              </div>

              <div className={style.formGroup}>
                <label>Upload Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImages(e.target.files)}
                />
              </div>

              <IonButton onClick={handleSubmitJobRequest} type="submit" expand="full">
                Submit Request
              </IonButton>
            
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Services;
