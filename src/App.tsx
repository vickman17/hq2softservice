import React, { useEffect, useState } from 'react';
import { Route, useLocation, useHistory} from 'react-router-dom';
import { IonApp, IonRouterOutlet, useIonRouter, setupIonicReact, isPlatform } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@ionic/react/css/normalize.css';
import '@ionic/react/css/core.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import './App.css';

import BottomNav from "./components/BottomNav";
import SplashScreen from './components/SplashScreen';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Verify from './pages/Verify';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import NotificationPage from './pages/Notification';
import PayOption from './pages/PayOption';
import Inbox from './pages/Inbox';
import Security from './pages/Security';
import Jobs from './pages/Jobs';
import Profile from "./pages/Profile";
import Wallet from './pages/Wallet';
import Services from './pages/Services';
import Chat from './pages/Chat';
import IntroPage from './pages/IntroPage';
// import Promo from "./components/Promo";
import ProfilePics from './components/ProfilePics';
import SearchComponent from './components/SearchComponent';
import CardPayment from './components/CardPayment';
import RatingComponent from "./components/RatingComponent";
import PayJobModal from './components/PayJobModal';
import { PluginListenerHandle  } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";
import { FirebaseX } from '@ionic-native/firebase-x';
import { messaging, getToken as getWebToken, onMessage as onWebMessage } from './firebase/firebaseConfig';
interface NotificationData {
  title: string;
  body: string;
  // any other fields depending on the structure of the Firebase message
}

setupIonicReact();
const queryClient = new QueryClient();

const App: React.FC = () => {

  useEffect(() => {
    if (isPlatform('capacitor')) {
      // ✅ Native Push (FirebaseX)
      FirebaseX.grantPermission().then((granted) => {
        if (granted) {
          FirebaseX.getToken().then(token => {
            console.log("🔥 Android/iOS Token:", token);
            // Replace with your actual backend endpoint
            fetch('https://hq2app.free.beeceptor.com', {
              method: 'POST',
              body: JSON.stringify({ token }),
              headers: { 'Content-Type': 'application/json' }
            });
          }).catch(err => {
            console.error("❌ Error getting token:", err);
          });
        }
      }).catch(err => {
        console.error("❌ Permission not granted:", err);
      });

      FirebaseX.onMessageReceived().subscribe(data => {
        console.log("📥 Notification Received:", data);
      }, err => {
        console.error("❌ Error receiving notification:", err);
      });

      FirebaseX.onTokenRefresh().subscribe(newToken => {
        console.log("🔄 Token Refreshed:", newToken);
        // Send the new token to your backend
        fetch('https://hq2app.free.beeceptor.com', {
          method: 'POST',
          body: JSON.stringify({ token: newToken }),
          headers: { 'Content-Type': 'application/json' }
        });
      });
    } else {
      console.log("Webb shit")
      // ✅ Web Push
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          // ✅ Ensure the service worker is fully active and ready
          navigator.serviceWorker.register('/firebase-messaging-sw.js')
            .then(() => navigator.serviceWorker.ready)
            .then((registration) => {
              console.log('✅ Service Worker Ready:', registration);
  
              getWebToken(messaging, {
                vapidKey: 'BKhchly4Dnm0NHV8rBdm1YIwuXI8A0IRAkkhTwO2sjByFskp4-Qef3UWIocHnu_uNjJ2pb4DLV3ZFOzv1HNOohQ',
                serviceWorkerRegistration: registration
              }).then(token => {
                console.log("🔥 Web Token:", token);
                fetch('https://hq2app.free.beeceptor.com', {
                  method: 'POST',
                  body: JSON.stringify({ webToken: token }),
                  headers: { 'Content-Type': 'application/json' }
                });
              }).catch(err => {
                console.warn("❌ Token Error:", err);
              });
  
              onWebMessage(messaging, payload => {
                console.log("📥 Web Notification:", payload);

                  // Show a notification manually if needed
                if (Notification.permission === 'granted') {
                  const { title, body, icon } = payload.notification || {};
                  new Notification(title || 'Notification', {
                    body: body || 'You have a new message',
                    icon: icon || '/assets/icons/icon-512.webp'
                  });
                }
              });
            })
            .catch(err => {
              console.error("❌ Service Worker Registration Failed:", err);
            });
        } else {
          console.warn("❌ Notification permission not granted.");
        }
      });
    }
  }, []);
  
  return (
    <IonApp style={{ fontFamily: "Quicksand" }}>
      <QueryClientProvider client={queryClient}>
        <IonReactRouter>
          <AppContent />
        </IonReactRouter>
      </QueryClientProvider>
    </IonApp>
  );
};

const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();
  const history = useHistory();
  const pagesWithBottomNav = ['/dashboard', '/inbox', '/jobs', '/wallet', '/profile'].map(path => path.toLowerCase());

  // App-wide styles and platform-specific class
  useEffect(() => {
    document.body.style.fontFamily = "Varela Round, sans-serif";
    document.body.style.overflowX = "hidden";

    if (isPlatform('ios')) {
      document.body.classList.add('ios');
    } else {
      document.body.classList.add('android'); // ✅ Corrected
    }
  }, []);

  const ionRouter = useIonRouter();
    
  // Track modals state globally (you can update this in modal components)
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let backButtonListener: PluginListenerHandle;

    const setupListener = async () => {
        backButtonListener = await CapacitorApp.addListener("backButton", () => {
            if (isModalOpen) {
                setIsModalOpen(false);
            } else if (ionRouter.canGoBack()) {
                history.go(-1);
            } else {
                CapacitorApp.exitApp();
            }
        });
    };

    setupListener();

    return () => {
        if (backButtonListener) {
            backButtonListener.remove();
        }
    };
}, [isModalOpen, history, ionRouter]);


  // Splash screen timeout
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;



// Push notification Permission and token


  return (
    <>
      <IonRouterOutlet>
        <Route exact path="/" component={IntroPage} />
        <Route exact path="/home" component={IntroPage} />
        <Route path='/login' component={Login} />
        <Route path='/verify' component={Verify} />
        <Route path='/signup' component={Signup} />
        <Route path='/intro' component={IntroPage} />
        <Route path="/splash" component={SplashScreen} />
        {/* <Route path="/promo" component={Promo} /> */}
        <Route path="/profilepic" component={ProfilePics} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path='/notification' component={NotificationPage} />
        <Route path="/profile" component={Profile} />
        <Route path='/services' component={Services} />
        <Route path="/wallet" component={Wallet} />
        <Route path="/jobs" component={Jobs} />
        <Route path='/inbox' component={Inbox} />
        <Route path='/rating' component={RatingComponent} />
        <Route path='/security' component={Security} />
        <Route path="/chat/:chatRoomId/:jobId" component={Chat} />
        <Route path="/userlist" component={UserList} />
        <Route path='/payoption' component={PayOption} />
        <Route path='/search' component={SearchComponent} />
        {/* <Route path="/paystack" component={PaystackPayment} /> */}
        <Route path='/pay' component={CardPayment} />
        <Route path='/payjob' component={PayJobModal} />
      </IonRouterOutlet>

      {/* ✅ Bottom Navigation - Conditionally Rendered */}
      {pagesWithBottomNav.includes(location.pathname.toLowerCase()) && <BottomNav />}
    </>
  );
};

export default App;
