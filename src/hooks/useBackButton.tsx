import { useEffect } from "react";
import { useIonRouter } from "@ionic/react";
import { App } from "@capacitor/app";

const useBackButton = (modals: boolean[], closeModalFns: (() => void)[]) => {
    const ionRouter = useIonRouter();

    useEffect(() => {
        const handleBackButton = () => {
            const lastOpenIndex = modals.lastIndexOf(true);
            if (lastOpenIndex !== -1) {
                closeModalFns[lastOpenIndex]();
            } else if (ionRouter.canGoBack()) {
                ionRouter.goBack();
            } else {
                console.log("No history to go back to!");
            }
        };

        // Listen for Android back button events
        let backButtonListener: any;
        const setupListener = async () => {
            backButtonListener = await App.addListener("backButton", handleBackButton);
        };
        setupListener();

        // Listen for browser back button
        window.addEventListener("popstate", handleBackButton);

        return () => {
            if (backButtonListener) {
                backButtonListener.remove();
            }
            window.removeEventListener("popstate", handleBackButton);
        };
    }, [modals, closeModalFns, ionRouter]);
};

export default useBackButton;
