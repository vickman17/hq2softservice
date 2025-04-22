import React, { useEffect, useState } from "react";
import { IonButton, IonInput, IonText, IonSpinner } from "@ionic/react";

const RatingComponent: React.FC<{ userId: string; jobId: string; onSubmit: (rating: number, feedback: string) => void }> = ({ userId, jobId, onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [isRated, setIsRated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch the user's rating from the backend
    fetch(`http://localhost/hq2ClientApi/fetchRating.php?userId=${userId}&jobId=${jobId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.rating) {
          setRating(data.rating);
          setFeedback(data.feedback);
          setIsRated(true);
          console.log(rating)
          console.log(feedback)
        }
      })
      .catch((err) => console.error("Error fetching rating:", err))
      .finally(() => setLoading(false));
  }, [userId, jobId]);

  const handleRatingClick = (rate: number) => {
    if (!isRated) {
      setRating(rate);
    }
  };

  const loader = "/assets/loader.gif";

  if (loading) {
    return(
    <div style={{border: "0px solid", width: "300px", height: "200px", margin: "auto", display: "flex", alignItems: "center", justifyContent: "center"}}>
      <div style={{border: "0px solid", width: "40px"}}>
        <img src={loader} />
      </div>
    </div> )
  }

console.log(feedback);

  return (
    <div style={{border: "0px solid", width: "95%", margin:"auto", marginTop: "10px"}} className="flex flex-col items-center p-4">
      <div style={{border: "0px solid", textAlign: "center", paddingBlock: "10px", fontWeight: "600", color: "var(--ion-company-wood)"}}>{isRated ? "Your Rating" : "Rate Service"}</div>
      <div className="flex space-x-2 mb-4" style={{ border: "0px solid", display: "flex", justifyContent: "space-around", alignItems: "center", width: "180px", margin: "auto"}}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            style={{width: "30px",}}
            className="w-10 h-10 cursor-pointer transition-all duration-200"
            fill={star <= (hovered ?? rating) ? "var(--ion-company-gold)" : "none"}
            stroke="var(--ion-company-gold)"
            strokeWidth="2"
            viewBox="0 0 24 24"
            onClick={() => handleRatingClick(star)}
            onMouseEnter={() => !isRated && setHovered(star)}
            onMouseLeave={() => setHovered(null)}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
          </svg>
        ))}
      </div>

      {isRated ? (
        feedback ? <div style={{fontStyle: "italic", border: "0px solid", borderRadius: "4px", textAlign: "center", marginTop: "14px", padding: "5px", background: "grey"}}>"{feedback}"</div> : ""
      ) : (
        <div style={{marginTop: "1rem"}}>
        <div style={{color: "var(--ion-company-wood)", fontWeight: "600"}}>We'd love to hear from you!</div>
          <textarea
            style={{border: "1px solid grey", borderRadius: "5px"}}
            placeholder="Leave us a feedback..."
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <IonButton
            expand="full"
            style={{"--background": "var(--ion-company-wood)"}}
            className="mt-3"
            disabled={rating === 0}
            onClick={() => {
              onSubmit(rating, feedback);
              setIsRated(true);
            }}
          >
            Submit Rating
          </IonButton>
        </div>
      )}
    </div>
  );
};

export default RatingComponent;
