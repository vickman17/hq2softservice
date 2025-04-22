import React from 'react';
import { IonIcon } from '@ionic/react';
import { chevronBack } from 'ionicons/icons';
import style from "./Back.module.css";
import { useHistory } from 'react-router';

interface BackProps {
    defaultLocation?: string;
}

const Back: React.FC<BackProps> = ({ defaultLocation }) => {
    const history = useHistory();

    const handleBack = () => {
        if (history.length > 1) {
            history.goBack(); // Go to the previous page in the history stack
        } else if (defaultLocation) {
            history.push(defaultLocation); // Go to specified route if no history
        } else {
            history.push('/dashboard'); // Default to home page if no other options
        }
    };

    return (
        <div className={style.Back} onClick={handleBack}>
            <IonIcon icon={chevronBack}></IonIcon>
        </div>
    );
};

export default Back;
