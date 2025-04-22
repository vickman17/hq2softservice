import React, { useEffect, useState, useRef } from 'react';
import {
  IonPage,
  IonHeader,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonModal,
  IonButton,
  IonTextarea,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { sendSharp, cameraSharp, arrowBack, informationSharp, chevronBackOutline } from 'ionicons/icons';
import style from './style/Chat.module.css';
import { db } from '../firebase/firebaseConfig';
import { collection, query, orderBy, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';

interface Message {
  userId: string;
  senderId: string;
  message: string;
  timestamp: string;
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

const Chat: React.FC = () => {
  const { chatRoomId, jobId } = useParams<{ chatRoomId: string; jobId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const history = useHistory();

  const storedInfo = sessionStorage.getItem("userInfo");
  const info = storedInfo ? JSON.parse(storedInfo) : {};
  const sspId = info?.id || info?.user_id; // Use `id` or `user_id` based on your data

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedHours = hours < 10 ? `0${hours}` : hours;

    return `${formattedHours}:${formattedMinutes}`;
  };

  useEffect(() => {
    if (chatRoomId) {
      const messagesRef = collection(db, 'chatRooms', chatRoomId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => doc.data() as Message);
        setMessages(newMessages);
      });
      return () => unsubscribe();
    }
  }, [chatRoomId]);

  const fetchJobDetails = async () => {
    try {
      const response = await fetch("http://localhost/hq2sspapi/getJobDetails.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const data = await response.json();
      setJobDetails(data.jobDetails);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const sendMessage = async () => {
    if (newMessage.trim() && chatRoomId) {
      try {
        const messagesRef = collection(db, 'chatRooms', chatRoomId, 'messages');
        await addDoc(messagesRef, {
          message: newMessage,
          senderId: sspId, // Use the correct `sspId`
          timestamp: Timestamp.now(), // Firestore's timestamp
        });
        setNewMessage('');
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = event.target.value;
    setNewMessage(inputText);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const openDetails = () => {
    setIsJobModalOpen(true);
  };

  return (
    <IonPage>
      <IonHeader style={{ border: "0px solid", boxShadow: "none" }}>
        <div className={style.head}>
          <div onClick={() => history.push('/inbox')} className={style.back}>
            <IonIcon icon={chevronBackOutline} />
          </div>
          <div className={style.chatName}>
            {jobDetails?.skill}
          </div>
          <div onClick={openDetails} className={style.back}>
            <IonIcon icon={informationSharp} />
          </div>
        </div>
      </IonHeader>
      <IonContent className={style.content} style={{ '--overflow': 'hidden', position: 'relative', marginTop: '14rem' }}>
        <div className={style.chatField}>
          <IonList lines="none">
          <div className={style.chatTag}>Drop a message our agents are active <img width={13} src="/assets/svg/happyOutline.svg" /> </div>
            {messages.map((message, index) => (
              <IonItem key={index}>
                <div style={{ border: '0px solid', width: '100%', marginTop: '12px' }}>
                  <div
                    style={{
                      padding: '0',
                      paddingBlock: '15px',
                      paddingInline: '10px',
                      fontSize: '16px',
                      textAlign: 'left',
                      width: 'fit-content',
                      fontFamily: 'Rubik',
                      color: 'white',
                      maxWidth: '80%',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      background:
                        message.senderId === sspId
                          ? 'linear-gradient(320deg, var(--ion-company-wood), var(--ion-company-gold))'
                          : 'var(--ion-company-wood)',
                      borderTopLeftRadius: message.senderId === sspId ? '1rem' : '1rem',
                      borderTopRightRadius: message.senderId === sspId ? '1rem' : '1rem',
                      borderBottomLeftRadius: message.senderId === sspId ? '1rem' : '0',
                      borderBottomRightRadius: message.senderId === sspId ? '0' : '1rem',
                      margin: message.senderId === sspId ? '7px 0 0 auto' : '7px auto 0 0',
                    }}
                  >
                    {message.message}
                  </div>
                  <p
                    style={{
                      fontSize: '11.5px',
                      width: 'fit-content',
                      margin: message.senderId === sspId ? '3px 0 0 auto' : '3px 0 auto 0',
                      border: '0px solid',
                      color: 'grey',
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                <div ref={messagesEndRef}></div>
              </IonItem>
            ))}
          </IonList>
        </div>
        <div className={style.bottomContent}>
          <div className={style.chatBox}>
            <textarea
              ref={textareaRef}
              value={newMessage}
              onInput={handleInput}
              className={style.textArea}
              style={{
                width: '100%',
                overflow: 'hidden',
                resize: 'none',
                boxSizing: 'border-box',
                outline: 'none',
                height: newMessage.includes('\n') ? `${Math.min(textareaRef.current?.scrollHeight || 20, 200)}px` : '20px',
                minHeight: '32px',
                maxHeight: '200px',
                border: '1px solid #ccc',
                padding: '5px',
                fontSize: '16px',
                lineHeight: '1.5',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            ></textarea>
          </div>
          <div className={style.sendButton}>
            {newMessage.trim().length > 0 ? (
              <div className={style.iconCont}>
                <IonIcon className={style.icon} onClick={sendMessage} icon={sendSharp} />
              </div>
            ) : (
              <div className={style.iconCont}>
                <IonIcon className={style.icon} icon={cameraSharp} />
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Chat;