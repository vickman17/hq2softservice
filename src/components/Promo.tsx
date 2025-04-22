// import React, { useState } from "react";
// // import Slider from "react-slick";
// import { IonCard } from "@ionic/react";
// import styles from "./Promo.module.css"; // Replace with your actual styles
// import { DotLottieReact } from '@lottiefiles/dotlottie-react'; // Import DotLottieReact

// const Promo: React.FC = () => {
//   const gotoservice = () => {
//     console.log("Navigate to service");
//   };

//   const [dotLottie, setDotLottie] = useState(null);

//   // Slick settings
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1, // Show one slide at a time
//     slidesToScroll: 1,
//     centerMode: true,
//     arrows: true,
//     variableWidth: false, // Disable dynamic card width resizing
//     autoplay: true, // Optionally, you can set autoplay
//     autoplaySpeed: 2000 // Interval between slides
//   };

//   return (
//     <IonCard className={styles.carouselContainer}>
//       <Slider className={styles.slide} {...settings}>
//         {/* Slide 1 with Lottie animation in the background */}
//         <div style={{background: "blue"}} className={styles.card}>
//               {/* Lottie Animation as Background */}
//               <div className={styles.lottieBackground}>
//                 <DotLottieReact
//                   src="/assets/painter.lottie" // Path to your Lottie animation file
//                   loop
//                   autoplay
//                   className={styles.anime}
//                 />
//               </div>
//               <div className={styles.write}>
//               <h4>25% OFF</h4>
//                 <p>On first painting order</p>
//                 <button onClick={gotoservice} className={styles.book}>
//                   Book now
//                 </button>
//               </div>
//         </div>

//         {/* Slide 2 */}
//         <div className={styles.card}>
//           <div>
//             <h4>15% OFF</h4>
//             <p>On first electrical order</p>
//             <button onClick={gotoservice} className={styles.book}>
//               Book now
//             </button>
//           </div>
//         </div>

//         {/* Slide 3 */}
//         <div className={styles.card}>
//           <div>
//             <h4>10% OFF</h4>
//             <p>On first baking order</p>
//             <button onClick={gotoservice} className={styles.book}>
//               Book now
//             </button>
//           </div>
//         </div>
//       </Slider>
//     </IonCard>
//   );
// };

// export default Promo;
