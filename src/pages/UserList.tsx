import React, { useState, useEffect } from "react";
import { IonList, IonItem, IonSpinner } from "@ionic/react";
import { useHistory } from "react-router-dom";
// import PaystackPayment from "../components/PaystackPayment";

const UserList: React.FC = () => {
  const history = useHistory();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


  return (
    <>
    {/* <PaystackPayment transactionType="top up" /> */}
    </>
  );
};

export default UserList;
