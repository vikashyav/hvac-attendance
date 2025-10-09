"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast";
// import { useModal } from "@/components/comfirmation-modal"
export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showButton, setShowButton] = useState(false);
    const { toast } = useToast()

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e); // Save event for later
            setShowButton(true);  // Show install button
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    useEffect(() => {
        if (showButton) {
            toast({
                title: "Install Attendance App",
                description: "Add the app to your home screen for quick access.",
                action: (
                    <ToastAction altText="Install App"
                        onClick={handleInstallClick}
                    >
                        Install App
                    </ToastAction>
                ),
                duration: 180000, // auto-hide after 3min
            });
        }
    }, [showButton])

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt(); // Show native install prompt
        // alert("hii")
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response: ${outcome}`);
        setDeferredPrompt(null);
        setShowButton(false);
    };

    // if (!showButton) 
    return null;

    // return (
    //     <div className=" bg-blue-600 bg-opacity-50 z-50 flex flex-col items-center justify-center px-4 py-2">
    //         <p className="text-red-500">⚠️ Payment pending! Please clear your dues to keep your Thermopharm Attendance App active.</p>
    //         {/* <button
    //             onClick={handleInstallClick}
    //             className="px-4 py-2 rounded bg-white text-blue-600 hover:bg-blue-700 text-sm"
    //         >
    //             Install App
    //         </button> */}
    //     </div>
    // );
}
