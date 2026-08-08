// frontend/src/hooks/useToastMessage.js
import { useState, useEffect, useCallback } from "react";
const useToastMessage = () => {
    const [showToast, setShowToast] = useState("");
    
    useEffect(() => {
        if (!showToast) return;
        
        const timer = setTimeout(() => {
            setShowToast("");
        }, 2000);
        
        return () => clearTimeout(timer);
    },
    
    [showToast]);
    
    const showToastMsg = useCallback((msg) => {
        setShowToast(msg);
    }, []);
    
    return {
        showToast,
        showToastMsg,
    };
};
export default useToastMessage;