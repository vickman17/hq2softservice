import React from "react";
import { IonModal, IonContent, IonSkeletonText } from "@ionic/react";
import styles from "../pages/style/Dashboard.module.css";
import CloseModal from "./CloseModal";


interface SubcategoryModalProps {
  isOpen: boolean;
  closeModal: () => void;
  selectedCategory: any;
  subcategories: any[];
  loader: boolean;
  handleSubcategoryClick: (subcategory: any) => void;
}

const SubcategoryModal: React.FC<SubcategoryModalProps> = ({
  isOpen,
  closeModal,
  selectedCategory,
  subcategories,
  loader,
  handleSubcategoryClick,
}) => {
  return (
    <IonModal className={styles.partialModal} isOpen={isOpen} onDidDismiss={closeModal}>
      <IonContent className={styles.modal}>
        {selectedCategory && (
          <div
            style={{
              height: "270px",
              backgroundImage: `url(http://localhost/hq2ClientApi/${selectedCategory.category_pics})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            {/* Overlay */}
            <div style={{ background: "rgba(0, 0, 0, 0.587)", height: "100%" }}>
            <div onClick={closeModal} style={{border: "0px solid black", width: "fit-content", paddingTop: "10px"}}>
                <CloseModal title="" color="white" />
            </div>
              <div
                style={{
                  margin: "auto",
                  color: "white",
                  fontWeight: "700",
                  fontSize: "25px",
                  marginTop: "9rem",
                  width: "95%",
                  wordWrap: "break-word",
                }}
              >

                {selectedCategory.category_name}
              </div>
            </div>
          </div>
        )}
        <div  className={styles.randomContainer}>
          {loader ? (
            <IonSkeletonText animated />
          ) : subcategories.length > 0 ? (
            subcategories.map((subcategory) => (
              <div
                key={subcategory.id}
                className={styles.box}
                style={{ width: "fit-content", textAlign: "center", border: "1px solid" }}
                onClick={() => handleSubcategoryClick(subcategory)}
              >
                <div>{subcategory.subcategory_name}</div>
              </div>
            ))
          ) : (
            <p>No subcategories found.</p>
          )}
        </div>
      </IonContent>
    </IonModal>
  );
};

export default SubcategoryModal;
