import { IonInput, IonModal, IonHeader, IonList, IonTextarea, IonItem, IonMenu, IonImg, IonPage, IonToolbar, IonContent, IonSkeletonText, IonCard, IonLabel, IonButton, IonMenuButton, IonIcon } from "@ionic/react";
import React, { useEffect, useState } from "react";
import styles from './style/Dashboard.module.css';
import ProfilePics from "../components/ProfilePics";
import '../theme/variables.css';
import { useHistory, useLocation, useParams} from "react-router-dom";
import { searchOutline, arrowForward} from "ionicons/icons";
import { motion } from "framer-motion";
import { useQuery } from '@tanstack/react-query';
import { createChatRoom } from '../services/ChatServices';
import SearchComponent from "../components/SearchComponent";
import { Category } from "../types";
import CategoryModal from "../components/CategoryModal";
import SubcategoryModal from "../components/SubcategoryModal";
import JobRequestModal from "../components/JobRequestModal";
import map from "/assets/svg/location.svg";
import useBackButton from "../hooks/useBackButton";
import {modalController} from "@ionic/core";



const capitalizeFirstLetter = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

  interface searchCategory {
    id: number;
    name: string;
    subcategories: string[];
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

const backgroundImages = [
    '/assets/toolswood.jpg',
    '/assets/painttool.jpg',
    '/assets/mechtools.jpg',
    '/assets/cleantool.jpg',
    '/assets/event.jpg',
    '/assets/actool.jpg',
    '/assets/map.jpeg',
  ];

const Dashboard: React.FC = () => {
    useEffect(() => {
        document.body.style.overflowX = "hidden";
        document.body.style.fontFamily = 'Varela Round';
    }, []);

    useEffect(()=>{
      localStorage.setItem("Intro", "seen")
    }, [])
    

        // Fetch categories when component mounts
        useEffect(() => {
          fetch("http://localhost/hq2ClientApi/fetchCategory.php") // Replace with your actual API
              .then((res) => res.json())
              .then((data) => {
                  setCategories(data);
                  setIsLoading(false);
              })
              .catch((error) => {
                  console.error("Error fetching categories:", error);
                  setIsLoading(false);
              });
      }, []);
  

    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[]>([]); // State to hold search results
    const [loading, setLoading] = useState<boolean>(false);
    const camera = "/assets/camera.png";
    const hospitality = "/assets/cook.png"
    const history = useHistory();
      const [index, setIndex] = useState(0);
      const [categories, setCategories] = useState<Category[]>([]);
      const [isLoading, setIsLoading] = useState(true);
    
      const [showModal, setShowModal] = useState(false);
      const [showJobRequestModal, setShowJobRequestModal] = useState(false);
      const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
      const [selectedSubcategory, setSelectedSubcategory] = useState<{ id: number; subcategory_name: string } | null>(null);
      const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
      const [toast, setToast] = useState(false);
      const [toastText, setToastText] = useState("");
      const [showServiceModal, setShowServiceModal] = useState<boolean>(false);

      const location = useLocation<{ serviceName?: string; subcategoryName?: string }>();
      const { serviceId, subcategoryId } = useParams<RouteParams>();
      const userDetails = sessionStorage.getItem('userInfo');
      const parsedData = userDetails ? JSON.parse(userDetails) : null;
      const userId = parsedData?.user_id;
      const firstName = parsedData?.firstName || "Hello";
      const lastName = parsedData?.lastName || "Guest";
      const plan = parsedData?.plan;
      const [serviceName, setServiceName] = useState<string | null>(null);
      const [subcategoryName, setSubcategoryName] = useState<string | null>(null);
      const [loader, setLoader] = useState<boolean>(false);
    
      const [address, setAddress] = useState<string>('');
      const [additionalDetails, setAdditionalDetails] = useState<string>('');
      const [images, setImages] = useState<FileList | null>(null);
      const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
      // const { liveLocation, liveAddress, error } = useLiveLocation();
    

const openService = () => {
    setShowServiceModal(true)
}

const closeService = () => {
    setShowServiceModal(false)
}

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Change background every 5 seconds

    return () => clearInterval(interval);
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


  const handleCategoryClick = async (category: Category) => {
    setShowSubcategoryModal(true);
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

  const closeSubcategoryModal = () => {
    setShowSubcategoryModal(false);
  }

  // const handleSubcategoryClick = (subcategory: Subcategory) => {
  //   setShowJobRequestModal(true);
  //   setSelectedSubcategory(subcategory.subcategory_name);
  //   console.log(subcategory.subcategory_name)
  //   setShowModal(false);
  // };

   
  const closeModal = () => {
    setShowModal(false);
  };

  const closeJobRequestModal = () => {
    setShowJobRequestModal(false);
  };



    const [isSearchActive, setIsSearchActive] = useState(false);
const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

const handleFocus = () => {
    setIsSearchActive(true);
    // Example suggestions (replace with API call)
    setSearchSuggestions(["Electrician", "Plumber", "Painter", "AC Repair", "Cleaning Service", "Cleaning Service", "Cleaning Service", "Cleaning Service", "Cleaning Service", "Cleaning Service"]);
};

const handleBlur = () => {
    setTimeout(() => setIsSearchActive(false), 200); // Delay to allow click on suggestion
};



const handleCategorySelect = (category: Category) => {
  setSelectedCategory(category);
  handleCategoryClick(category);
  setShowModal(true); // Open subcategory modal
  setShowServiceModal(false);
};

const handleSubcategorySelect = (subcategory: { id: number; subcategory_name: string }) => {
  console.log(subcategory);
  setSelectedSubcategory(subcategory); // Ensure subcategory is an object
  setShowJobRequestModal(true); // Open job request modal
  setShowModal(false); // Close subcategory modal
};

useBackButton(
  [showServiceModal, showJobRequestModal, showSubcategoryModal], 
  [() => setShowServiceModal(false), () => setShowJobRequestModal(false), () => setShowSubcategoryModal]
);

  
            const LoginFunc = async () => {
              setShowJobRequestModal(false)
              setShowSubcategoryModal(false)
              setShowServiceModal(false)
              history.push("/home")
            }     

    return (
        <IonPage >
            <IonContent className={styles.page}>
            <motion.div
          key={index}
          className={styles.background}
          style={{ backgroundImage: `url(${backgroundImages[index]})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />

        <div className={styles.topCont}>
            <div style={{border: "0px solid", width: "95%", margin: "auto", display: "flex", justifyContent: "space-between"}}>
                <div style={{display: "flex", border: "0px solid black", width: "60%", alignItems: "center"}}>
                    {/* <div style={{width: "45px", height: "45px"}}>
                      <ProfilePics/>
                    </div> */}
                    <div className={styles.id}>
                        <div style={{fontSize: "17px", fontWeight:"600"}} className={styles.name}>{capitalizeFirstLetter(firstName)} {capitalizeFirstLetter(lastName)}</div>
                        <div
                          onClick={() => {
                            if (!plan) {
                              history.push("/home"); // For React Router v5
                              // navigate("/login"); // For React Router v6
                            }
                          }}
                        style={{marginTop: "2px", color: plan ? "" : "var(--ion-company-gold)", fontWeight: plan ? "" : "800", fontSize: plan ? "14px" : "16px"}}>{plan ? plan : "Login"}</div>
                    </div>
                </div>

                <div style={{display: "flex", alignItems: "center", fontSize: "14px"}}>
                  <div style={{paddingRight: "4px"}}><img width={20} src={map} /></div>
                      NG
                  </div>
                </div>

                <div>
                <SearchComponent onCategorySelect={handleCategorySelect} />
                </div>
            </div>    
             
          <div className={styles.backCont}>
              <div className={styles.itemCont}>
              {isLoading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className={styles.categoryItem}>
                          <IonSkeletonText animated style={{ width: '100%', height: '100%' }} />
                      </div>
                  ))
              ) : (
                  Array.isArray(categories) && categories.length > 0 ? (
                      categories.slice(0, 3).map((category) => ( // Slice first 3 items
                          <div
                              key={category.id}
                              className={styles.item}
                              onClick={() => handleCategoryClick(category)}
                          >
                              <div className={styles.imgCont}>
                                  <img 
                                      style={{
                                          width: "100%", 
                                          height: "100%",  
                                          objectFit: "cover", 
                                          objectPosition: "center", 
                                          borderRadius: ".6rem", 
                                          margin: "auto"
                                      }}  
                                      src={`http://localhost/hq2ClientApi/${category.category_pics}`} 
                                      alt={category.category_name}
                                  />
                              </div>
                              <div style={{ border: "0px solid", width: "95%", margin: "auto", marginTop: "5px", textAlign: "right" }}>0</div>
                              <div className={styles.categoryName}>{category.category_name}</div>
                          </div>
                      ))
                  ) : (
                      <p>No categories found.</p>
                  )
              )}
              <div onClick={openService} style={{background: "transparent", color: "black", display: "flex", justifyContent: "center", alignItems: "center"}}>
                      see all
                      <IonIcon icon={arrowForward} />
                  </div>
              </div>
              <div style={{border: "1px solid var(--ion-company-wood)", paddingBlock: "10px", textAlign: "center", margin: "auto", marginTop: "18px", fontSize: "21px", width: "90%", borderRadius: ".7rem", fontWeight: "800", color: "var(--ion-company-wood)"}} onClick={()=>setShowServiceModal(true)}>
                View all services
              </div>
          </div>
          
            </IonContent>
                        {/* Modal */}
                        <CategoryModal
                isOpen={showServiceModal}
                onDidDismiss={() => setShowServiceModal(false)}
                categories={categories}
                isLoading={isLoading}
                handleCategoryClick={handleCategorySelect}
            />

<SubcategoryModal
          isOpen={showSubcategoryModal}
          closeModal={closeSubcategoryModal}
          selectedCategory={selectedCategory}
          subcategories={subcategories}
          loader={loader}
          handleSubcategoryClick={handleSubcategorySelect}
        />

<JobRequestModal
          isOpen={showJobRequestModal}
          selectedSubcategory={selectedSubcategory} // Ensure it's an object
          selectedCategory={selectedCategory}
          onClose={() => setShowJobRequestModal(false)}
          Login={LoginFunc}
        />
        </IonPage>
    )
}

export default Dashboard
