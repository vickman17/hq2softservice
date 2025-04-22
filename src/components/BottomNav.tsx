import React from 'react';
import {
  IonFooter,
  IonTabBar,
  IonTabButton,
  useIonRouter
} from '@ionic/react';
import { useLocation } from 'react-router-dom';
import edit from './BottomNav.module.css';
import homeSolid from '/assets/svg/homeSolid.svg';
import homeOutline from '/assets/svg/homeOutline.svg';
import chatSolid from '/assets/svg/chatSolid.svg';
import chatOutline from '/assets/svg/chatOutline.svg';
import bellOutline from '/assets/svg/bellOutline.svg';
import bellSolid from '/assets/svg/bellSolid.svg';
import walletOutline from '/assets/svg/walletOutline.svg';
import walletSolid from '/assets/svg/walletSolid.svg';
import userOutline from '/assets/svg/userOutline.svg';
import userSolid from '/assets/svg/userSolid.svg';
import toolOutline from '/assets/svg/toolOutline.svg';
import toolSolid from '/assets/svg/toolSolid.svg';
import ProfilePics from './ProfilePics';

const BottomNav: React.FC = () => {
  const router = useIonRouter();
  const location = useLocation();
  const currentPath = location.pathname;

  const getActiveTab = () => {
    if (currentPath === '/dashboard') return 'home';
    if (currentPath === '/inbox') return 'chat';
    if (currentPath === '/jobs') return 'jobs';
    if (currentPath === '/profile') return 'settings';
    if (currentPath === '/wallet') return 'wallet';
    return '';
  };

  const activeTab = getActiveTab();

  const handleTabClick = (path: string) => {
    router.push(path, 'forward');
  };

  return (
    <IonFooter className={edit.navbar + " bottom-nav"} style={{ '--background': 'transparent', '--boxShadow': 'none', border: 'none' }}>
      <IonTabBar
        slot="bottom"
        style={{ boxShadow: 'none', '--background': 'transparent', border: 'none' }}
      >
        <IonTabButton key="home" tab="home" className={edit.tab} onClick={() => handleTabClick('/dashboard')}>
          <div className="tab-home">
            <div className={activeTab === 'home' ? edit.activeTab : ''}>
              <img src={activeTab === 'home' ? homeSolid : homeOutline} width={20} height={20} />
            </div>
            <div style={{ fontWeight: activeTab === 'home' ? '700' : '', fontSize: '10px', color: "var(--ion-company-wood)" }}>Home</div>
          </div>
        </IonTabButton>

        <IonTabButton key="chat" tab="chat" className={edit.tab} onClick={() => handleTabClick('/inbox')}>
          <div className="tab-chat">
            <div className={activeTab === 'chat' ? edit.activeTab : ''}>
              <img src={activeTab === 'chat' ? chatSolid : chatOutline} width={20} height={20} />
            </div>
            <div style={{ fontWeight: activeTab === 'chat' ? '700' : '', fontSize: '10px', color: "var(--ion-company-wood)" }}>Inbox</div>
          </div>
        </IonTabButton>

        <IonTabButton key="wallet" tab="wallet" className={edit.tab} onClick={() => handleTabClick('/wallet')}>
          <div className="tab-wallet">
            <div className={activeTab === 'wallet' ? edit.activeTab : ''}>
              <img src={activeTab === 'wallet' ? walletSolid : walletOutline} width={20} height={20} />
            </div>
            <div style={{ fontWeight: activeTab === 'wallet' ? '700' : '', fontSize: '10px', color: "var(--ion-company-wood)" }}>Wallet</div>
          </div>
        </IonTabButton>

        <IonTabButton key="jobs" tab="jobs" className={edit.tab} onClick={() => handleTabClick('/jobs')}>
          <div className="tab-jobs">
            <div className={activeTab === 'jobs' ? edit.activeTab : ''}>
              <img src={activeTab === 'jobs' ? toolSolid : toolOutline} width={20} height={20} />
            </div>
            <div style={{ fontWeight: activeTab === 'jobs' ? '700' : '', fontSize: '10px', color: "var(--ion-company-wood)" }}>Jobs</div>
          </div>
        </IonTabButton>

        <IonTabButton key="settings" tab="settings" className={edit.tab} onClick={() => handleTabClick('/profile')}>
          <div className="tab-settings">
            <div className={activeTab === 'settings' ? edit.activeTab : ''}>
            <img src={activeTab === 'settings' ? userSolid : userOutline} width={20} height={20} />
            </div>          
            <div style={{ fontWeight: activeTab === 'settings' ? '700' : '', fontSize: '10px', color: "var(--ion-company-wood)" }}>Profile</div>
          </div>
        </IonTabButton>
      </IonTabBar>
    </IonFooter>
  );
};

export default BottomNav;
