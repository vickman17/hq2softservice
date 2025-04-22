import React from "react";
import { useHistory } from "react-router";
import style from "./Logout.module.css";

const Logout: React.FC = () => {

   const history = useHistory();


    const logout = () =>{
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        history.push('/login')
    }



    return(
        <div className={style.logout} onClick={logout}>
            Sign Out
        </div>
    )
}

export default Logout;