// src/services/chatService.ts
import { db } from '../firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const createChatRoom = async (jobId: string, adminId: string, userId: string) => {
  const chatRoomId = `${jobId}-${adminId}-${userId}`; // Unique chat room ID
  const chatRoomRef = doc(db, 'chatRooms', chatRoomId);

  await setDoc(chatRoomRef, {
    jobId,
    adminId,
    userId,
  });

  return chatRoomId;
};

export { createChatRoom };
