import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import styles from "./SearchComponent.module.css";
import searchIcon from "/assets/svg/search.svg";
import { Category } from "../types"; 
import SubcategoryModal from "./SubcategoryModal";
import JobRequestModal from "./JobRequestModal";
import { useHistory } from "react-router";
import loader from "/assets/loader.gif";

interface SearchComponentProps {
  onCategorySelect: (category: Category) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onCategorySelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<{ type: "category" | "subcategory"; name: string; category?: Category }[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
const [showJobRequestModal, setShowJobRequestModal] = useState(false);
const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
const [selectedSubcategory, setSelectedSubcategory] = useState<{ subcategory_name: string } | null>(null);
const history = useHistory();
const [subcategories, setSubcategories] = useState<string[]>([]);



const LoginFunc = async () => {
  setShowJobRequestModal(false)
  setShowSubcategoryModal(false)
  history.push("/home")
}

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost/hq2ClientApi/searchCategory.php");
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error("Invalid API response format", response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleFocus = () => setIsSearchActive(true);
  const handleBlur = () => setTimeout(() => setIsSearchActive(false), 200);

  const debounceSearch = useCallback(
    (term: string) => {
      if (!term.trim()) {
        setSearchSuggestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const query = term.toLowerCase().trim();
      const filteredResults = categories.flatMap(category => {
        const matches: { type: "category" | "subcategory"; name: string; category?: Category }[] = [];

        if (category.name.toLowerCase().includes(query)) {
          matches.push({ type: "category", name: category.name, category });
        }

        if (Array.isArray(category.subcategories)) {
          category.subcategories.forEach(sub => {
            if (sub.toLowerCase().includes(query)) {
              matches.push({ type: "subcategory", name: sub, category });
            }
          });
        }

        return matches;
      });

      setSearchSuggestions(filteredResults.length > 0 ? filteredResults : [{ type: "category", name: "No results found" }]);
      setLoading(false);
    },
    [categories]
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      debounceSearch(searchTerm);
    }, 300); // 300ms debounce for performance

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, debounceSearch]);

  const handleSuggestionClick = (suggestion: { type: "category" | "subcategory"; name: string; category?: Category }) => {
    if (suggestion.type === "category" && suggestion.category) {
      // Open Subcategory Modal
      setSelectedCategory(suggestion.category);
      setShowSubcategoryModal(true);
    } else if (suggestion.type === "subcategory" && suggestion.category) {
      // Open Job Request Modal
      setSelectedCategory(suggestion.category);
      setSelectedSubcategory({ subcategory_name: suggestion.name }); // Fix: Assign as an object
      setShowJobRequestModal(true);
    }
    setIsSearchActive(false);
  };
  
  console.log(selectedCategory?.subcategories)


  return (
    <div className={styles.searchContainer}>
      {isSearchActive && <div className={styles.overlay}></div>}
      <div className={styles.searchBox}>
        <div className={styles.searchCont}>
          <div className={styles.iconContainer} style={{paddingLeft: "5px"}}>
            <img src={searchIcon} width={20} alt="Search" />
          </div>

          <input
            ref={inputRef}
            placeholder="Search services"
            className={styles.search}
            type="text"
            value={searchTerm}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {isSearchActive && (
            <div className={styles.suggestions}>
              {loading ? (
                <div className={styles.suggestionItem}>🔄 Searching...</div>
              ) : (
                searchSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={styles.suggestionItem}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.type === "category" ? `` : `🔹 ${suggestion.name}`}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <SubcategoryModal
        isOpen={showSubcategoryModal}
        closeModal={() => setShowSubcategoryModal(false)}
        selectedCategory={selectedCategory}
        subcategories={subcategories} // Ensure this is passed correctly
        loader={true}
        handleSubcategoryClick={handleSuggestionClick}
      />


    <JobRequestModal
      isOpen={showJobRequestModal}
      selectedSubcategory={selectedSubcategory} 
      selectedCategory={selectedCategory}
      onClose={() => setShowJobRequestModal(false)}
      Login={LoginFunc}
    />

    </div>
  );
};

export default SearchComponent;
