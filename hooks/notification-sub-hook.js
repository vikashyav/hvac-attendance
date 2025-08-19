
// utils/subscribeForPush.js
import { useMutation, useQuery } from "@tanstack/react-query"
import { saveSubscrption, deleteSubscrption } from "@/lib/api/dashboard-api";
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react";

export function useNotificationSubscrption() {
    const { toast } = useToast()
    const saveSubscrptionMutation = useMutation({
        mutationFn: saveSubscrption,
    })

    const deleteSubscrptionMut = useMutation({
        mutationFn: deleteSubscrption
    });

    const [isSupported, setIsSupported] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
        setIsSupported(supported);

        if (supported) {
            checkSubscription();
        }
    }, []);

    async function checkSubscription() {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        setIsSubscribed(!!sub);
    }

    const subscribeForPush = async (userId) => {
        // alert("1")
        toast({
            title: "1",
            description: "Subscribed For Notification update",
        })
        // try {
        if (Notification.permission === "denied") {
            alert("Notifications are blocked. Please enable them in browser settings.");
            return;
        }

        const permission = await Notification.requestPermission();
        // alert("2")
        toast({
            title: "2",
            description: "Subscribed For Notification update",
        })
        if (permission !== "granted") {
            alert("Notifications permission not granted.");
            return;
        }
        // let reg = await navigator.serviceWorker.ready;
        const registration = await navigator.serviceWorker.register('/sw.js');
        toast({
            title: "2.5",
            description: "Subscribed For Notification update",
        })
        // await navigator.serviceWorker.register('/sw.js')
        const reg = await navigator.serviceWorker.ready;
        // alert("3")
        toast({
            title: "3",
            description: "Subscribed For Notification update",
        })

        const sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: "BAc-mxt5YMzEkGC5aF1dUQ5n0pL_y51IzdO5jXOoaGSjSXcd5OhWBd05sRb28njnF2xORneihyZoHB7cm4BS_VQ"
        });
        toast({
            title: "4",
            description: "Subscribed For Notification update",
        })
        if (sub) {
            return saveSubscrptionMutation.mutateAsync({ userId, subscription: sub }, {
                onSuccess: (res) => {
                    toast({
                        title: "Success",
                        description: "Subscribed For Notification update",
                    })
                    console.log("✅ Push subscribed:", sub);
                    setIsSubscribed(true);
                    window.location.reload(); // to trigger middleware check
                },
                onError: () => {
                    toast({
                        title: "Error",
                        description: "failed Subscribed For Notification update, Please contact support team",
                        variant: "destructive",
                    })
                    alert("something went wrong")
                    setTimeout(() => {
                        window.location.reload(); // to trigger middleware check
                    }, 500);
                }
            })
        }
    }


    const resetAndSubscribe = async (userId) => {
        // Wait for service worker to be ready
        const registration = await navigator.serviceWorker.ready;

        // Check if there's an existing subscription
        const existingSubscription = await registration.pushManager.getSubscription();

        // If yes, unsubscribe from it
        if (existingSubscription) {
            console.log('Unsubscribing old push subscription...');
            await existingSubscription.unsubscribe();
        }

        // Now subscribe again and send to backend
        await subscribeForPush(userId);

        console.log('Push subscription reset & saved.');
    }

    const unsubscribeNotification = async () => {
        try {
            // Wait for service worker to be ready
            const registration = await navigator.serviceWorker.ready;

            // Check if there's an existing subscription
            const existingSubscription = await registration.pushManager.getSubscription();

            // If yes, unsubscribe from it
            if (existingSubscription) {
                console.log('Unsubscribing old push subscription...');
                return deleteSubscrptionMut.mutateAsync({ endpoint: existingSubscription.endpoint }, {
                    onSuccess: async () => {
                        await existingSubscription.unsubscribe();
                        window.location.reload(); // to trigger middleware check
                        return
                    },
                    onError: () => {
                        toast({
                            title: "Error",
                            description: "unable to unsubcribe notification",
                        })
                        // to trigger middleware check
                        setTimeout(() => {
                            window.location.reload(); // to trigger middleware check
                        }, 500);
                    }
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error,
            })
            // to trigger middleware check
            setTimeout(() => {
                window.location.reload(); // to trigger middleware check
            }, 500);
        }

    }


    return {
        subscribeForPush, resetAndSubscribe, unsubscribeNotification
    }
}


// helper
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
