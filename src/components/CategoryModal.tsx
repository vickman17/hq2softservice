import React from "react";
import { IonModal, IonContent, IonSkeletonText } from "@ionic/react";
import styles from "../pages/style/Dashboard.module.css";
import star from "/assets/svg/starOutline.svg";
import CloseModal from "./CloseModal";

interface CategoryModalProps {
    isOpen: boolean;
    onDidDismiss: () => void;
    categories: any[]; // Adjust type accordingly
    isLoading: boolean;
    handleCategoryClick: (category: any) => void;
}


const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onDidDismiss, categories, isLoading, handleCategoryClick }) => {

    return(
        <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
            <div onClick={onDidDismiss} style={{border: "0px solid black", width: "fit-content", paddingTop: "10px"}}>
                <CloseModal title="" color="black" />
            </div>
        <IonContent>
                      {/* Overlay (Covers full page except search bar) */}
     
          <div 
          style={{border: "0px solid black", paddingBottom: "20px"}}
              // className={styles.itemCont}
          >
          {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className={styles.categoryItem}>
                      <IonSkeletonText animated style={{ width: '100%', height: '100%' }} />
                  </div>
              ))
          ) : (
              Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((category) => ( // Slice first 3 items
                      <div
                          key={category.id}
                          onClick={() => handleCategoryClick(category)}
                          style={{ position: "relative", cursor: "pointer" }}
                      >
                          <div className={styles.imgCont} style={{ position: "relative" }}>
                              <img
                                  style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      objectPosition: "center",
                                      borderRadius: ".6rem",
                                      margin: "auto",
                                      display: "block",
                                  }}
                                  src={`http://localhost/hq2ClientApi/${category.category_pics}`}
                                  alt={category.category_name}
                              />

                              {/* Black transparent overlay */}
                              <div
                                  style={{
                                      position: "absolute",
                                      top: 0,
                                      left: 0,
                                      width: "100%",
                                      height: "100%",
                                      backgroundColor: "rgba(0, 0, 0, 0.5)", // 50% transparent black
                                      borderRadius: ".6rem",
                                  }}
                              >
                                <div style={{border: "0px solid", width: "95%", height: "30px", textAlign: "right", margin: "auto", marginTop: "10px"}}>
                                  <img width={20} src={star} />
                                </div>
                              </div>

                              {/* Category Name on Image */}
                              <div
                                  style={{
                                      border: "0px solid #f5f5f5",
                                      width: "90%",
                                      position: "absolute",
                                      top: "85%",
                                      left: "50%",
                                      transform: "translate(-50%, -50%)",
                                      color: "#fff",
                                      fontWeight: "800",
                                      fontSize: "1.2rem",
                                      textAlign: "center",
                                      zIndex: 2, // Ensure it appears above the overlay
                                  }}
                              >
                                  {category.category_name}
                              </div>
                          </div>
{/* 
                          <div
                              style={{
                                  borderBottom: "0.5px solid rgb(238, 238, 238)",
                                  width: "95%",
                                  margin: "auto",
                                  marginTop: "5px",
                                  textAlign: "right",
                                  paddingBottom: ".5rem",
                                  marginBottom: ".5rem",
                              }}
                          >
                              0
                          </div> */}
                      </div>

                  ))
              ) : (
                  <p>No categories found.</p>
              )
          )}
          </div>
          </IonContent>
    </IonModal>

    )
}

export default CategoryModal;