// import React, { useState, useEffect } from "react";
// import { Browser } from "@capacitor/browser";
// import { useLocation } from "react-router-dom"; // To get query params

// interface PaystackData {
//     amount: number;
//     transactionType: string;
// }

// const PaystackPayment: React.FC<PaystackData> = ({ transactionType, amount }) => {
//     const backendUrl = "http://localhost/hq2ClientApi/initializePayment.php"; 
//     const verifyUrl = "http://localhost/hq2ClientApi/verifyPayment.php"; 
//     const currency = "NGN";

//     const userDetails = sessionStorage.getItem("userInfo");
//     const parsedData = userDetails ? JSON.parse(userDetails) : null;
//     const email = parsedData?.email || "ghost@example.com";
//     const userId = parsedData?.user_id || "guest";

//     const [loading, setLoading] = useState(false);
//     const [paymentSuccess, setPaymentSuccess] = useState(false);
//     const [error, setError] = useState("");

//     const location = useLocation(); // To get query parameters

//     const verifyTransaction = async (reference: string) => {
//         console.log("Reference received for verification:", reference); // Debugging
    
//         try {
//             const response = await fetch(`${verifyUrl}?reference=${reference}`);
//             const data = await response.json();
//             console.log("Verification API Response:", data); // Log API response
    
//             if (data.status) {
//                 setPaymentSuccess(true);
//             } else {
//                 setError("Payment verification failed.");
//             }
//         } catch (err) {
//             console.error("Error verifying payment:", err);
//             setError("Could not verify payment. Please try again.");
//         }
//     };
    

//     // Check if Paystack returned a transaction reference
//     useEffect(() => {
//         const queryParams = new URLSearchParams(location.search);
//         const reference = queryParams.get("reference");
//         if (reference) {
//             verifyTransaction(reference);
//         }
//     }, [location]);

//     // Function to start payment
//     const startPayment = async () => {
//         setLoading(true);
//         setError("");

//         try {
//             const response = await fetch(backendUrl, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email, amount: amount * 100, currency, transactionType, userId }),
//             });

//             const data = await response.json();
//             if (data.status && data.authorization_url) {
//                 await Browser.open({ url: data.authorization_url });
//             } else {
//                 setError("Error initializing payment.");
//             }
//         } catch (err) {
//             setError("Payment request failed.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div style={{ textAlign: "center" }}>
//             <button 
//                 style={{ 
//                     width: "90%", 
//                     fontSize: "18px", 
//                     fontWeight: "700", 
//                     paddingBlock: "10px", 
//                     borderRadius: "20px", 
//                     background: "var(--ion-company-wood)" 
//                 }} 
//                 onClick={startPayment}
//                 disabled={loading}
//             >
//                 {loading ? "Processing..." : "Proceed"}
//             </button>
//             {paymentSuccess && <p style={{ color: "green" }}>Payment was successful!</p>}
//             {error && <p style={{ color: "red" }}>{error}</p>}
//         </div>
//     );
// };

// export default PaystackPayment;
