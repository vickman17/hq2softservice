import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonList, IonItem, IonLabel, IonHeader, IonIcon, IonSkeletonText } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { locationOutline } from "ionicons/icons";
import style from "./style/Inbox.module.css";
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, getDocs, orderBy, limit, onSnapshot, serverTimestamp, updateDoc, setDoc, doc, getDoc } from 'firebase/firestore';

interface ChatRoom {
  roomId: string;
  jobId: string;
  userId: string;
  serviceProviderId: string;
  lastMessage: string;
  lastMessageTime: number;
  isUnread: boolean;
}

interface JobDetails {
  skill: string;
  address: string;
  local_government: string;
  state: string;
  additional_details: string;
  client_firstName: string;
  client_lastName: string;
}

const Inbox: React.FC = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [jobDetails, setJobDetails] = useState<{ [key: string]: JobDetails }>({});
  const [loading, setLoading] = useState(true); // Add loading state
  const storedInfo = sessionStorage.getItem('userInfo');
  const info = storedInfo ? JSON.parse(storedInfo) : {};
  const sspId = info?.id;
  const history = useHistory();




  useEffect(() => {
    document.body.style.fontFamily = 'Quicksand, sans-serif';
  }, []);




  const fetchChatRooms = async () => {
    try {
      const chatRoomsRef = collection(db, 'chatRooms');
      const q = query(chatRoomsRef, where('userId', '==', sspId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const rooms: ChatRoom[] = [];

        for (const docSnapshot of querySnapshot.docs) {
          const data = docSnapshot.data();
          const roomId = docSnapshot.id;
          const messagesRef = collection(doc(db, 'chatRooms', roomId), 'messages');
          const lastMessageListener = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));

          // Set up a listener for real-time updates on the last message
          onSnapshot(lastMessageListener, (snapshot) => {
            if (!snapshot.empty) {
              const lastMessageDoc = snapshot.docs[0].data();
              const lastMessage = lastMessageDoc?.message || '';
              const lastMessageTime = lastMessageDoc?.timestamp?.seconds || 0;

              setChatRooms((prevRooms) => {
                const updatedRooms = [...prevRooms];
                const roomIndex = updatedRooms.findIndex((room) => room.roomId === roomId);
                if (roomIndex !== -1) {
                  updatedRooms[roomIndex] = {
                    ...updatedRooms[roomIndex],
                    lastMessage,
                    lastMessageTime,
                    isUnread: updatedRooms[roomIndex].lastMessageTime < lastMessageTime,
                  };
                }
                return updatedRooms;
              });
            }
          });

          rooms.push({
            roomId,
            jobId: data.jobId,
            userId: data.userId,
            serviceProviderId: data.serviceProviderId,
            lastMessage: '',
            lastMessageTime: 0,
            isUnread: true,
          });
        }

        rooms.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
        setChatRooms(rooms);
        await fetchJobDetailsForRooms(rooms);
      } else {
        console.log('No chat rooms found for you:', sspId);
      }
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };

  const fetchJobDetailsForRooms = async (rooms: ChatRoom[]) => {
    try {
      const jobDetailsMap: { [key: string]: JobDetails } = {};
      for (const room of rooms) {
        const response = await fetch('http://localhost/hq2sspapi/getJobDetails.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jobId: room.jobId }),
        });

        if (response.ok) {
          const data = await response.json();
          const jobData = data.jobDetails;

          jobDetailsMap[room.jobId] = {
            skill: jobData?.skill || '',
            address: jobData?.address || '',
            local_government: jobData?.local_government || '',
            state: jobData?.state || '',
            additional_details: jobData?.additional_details || '',
            client_firstName: jobData?.client_firstName || '',
            client_lastName: jobData?.client_lastName || '',
          };
        } else {
          console.log('Error fetching job details for jobId:', room.jobId);
        }
      }
      setJobDetails(jobDetailsMap);
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  const updateLastRead = async (roomId: string, userId: string) => {
    try {
      const docRef = doc(db, 'chatRooms', roomId, 'metadata', 'lastRead');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, { [userId]: serverTimestamp() });
      } else {
        await setDoc(docRef, { [userId]: serverTimestamp() });
      }

      console.log('Last read timestamp successfully updated or created');
    } catch (error) {
      console.log("Timestamp error");
    }
  };

  const openChat = async (chatRoomId: string, jobId: string) => {
    try {
      await updateLastRead(chatRoomId, sspId);
      history.push(`/chat/${chatRoomId}/${jobId}`);
    } catch (error) {
      console.error('Error navigating to chat page:', error);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, [sspId]);

  return (
    <IonPage className={style.content}>
      <IonHeader style={{color: "var(--ion-company-wood)"}} className={style.header}>
        <div className={style.head}>Inbox</div>
      </IonHeader>
      {sspId ? 
      <IonContent>
        {loading ? (
          <IonList lines="none">
            {Array.from({ length: 13 }).map((_, index) => (
              <IonItem key={index}>
                <IonLabel>
                  <div style={{display: "flex", justifyContent:"space-between", alignItems: "center"}}>
                    <div style={{width: "70%"}}>
                      <IonSkeletonText animated style={{ width: '60%',   height: "20px" }} />
                      <IonSkeletonText animated style={{ width: '40%', height: "15px", marginTop: '8px' }} />
                    </div>
                    <div style={{width: "20%"}}>
                    <IonSkeletonText animated style={{ width: '100%', }} />
                    <IonSkeletonText animated style={{ width: '100%', marginTop: '8px' }} />
                    </div>
                  </div>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        ) : (
          <IonList lines="none">
            {(chatRooms.map((chatRoom) => (
              <IonItem   
                style={{ "--backgroundColor": chatRoom.isUnread ? '#f0f8ff' : 'transparent'}}
                key={chatRoom.roomId} onClick={() => openChat(chatRoom.roomId, chatRoom.jobId)}>
                <IonLabel style={{fontFamily: "Quicksand"}}>
                  {jobDetails[chatRoom.jobId] && (
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                      <div style={{fontSize: "17px", fontWeight: "800"}}> {jobDetails[chatRoom.jobId].skill}</div>
                      <div style={{fontSize:"10px", alignItems:"center", display: "flex"}}> <IonIcon icon={locationOutline} /> {jobDetails[chatRoom.jobId].state}, {jobDetails[chatRoom.jobId].local_government}</div>
                    </div>
                  )}
                  {chatRoom.lastMessage && (
                    <div style={{display: "flex", justifyContent: "space-between", marginTop: "5px", alignItems: "center", border: "0px solid black"}}>
                      <div style={{fontSize: "14px"}} className={style.last}> {chatRoom.lastMessage}</div>
                      <div style={{fontSize: "10px", width: "40%", textAlign: "right"}}> {new Date(chatRoom.lastMessageTime * 1000).toLocaleString()}</div>
                    </div>
                  )}
                </IonLabel>
              </IonItem>
            )))}
          </IonList>
          
        )}
      </IonContent>
       :  <div style={{border: "0px solid black", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "700"}}>
                Please <span onClick={()=>history.push("/home")} style={{color: "var(--ion-company-gold)", textDecoration: "underline"}}> &nbsp;Login&nbsp; </span> to continue using our service
          </div>}
    </IonPage>
  );
};

export default Inbox;
