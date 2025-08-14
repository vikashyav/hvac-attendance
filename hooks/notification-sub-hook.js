
// utils/subscribeForPush.js
import { useMutation, useQuery } from "@tanstack/react-query"
import { saveSubscrption, deleteSubscrption } from "@/lib/api/dashboard-api";
import { useToast } from "@/hooks/use-toast"

export function useNotificationSubscrption() {
    const { toast } = useToast()
    const saveSubscrptionMutation = useMutation({
        mutationFn: saveSubscrption,
    })

    const deleteSubscrptionMut = useMutation({
        mutationFn: deleteSubscrption
    })
    const subscribeForPush = async (userId) => {
        if (!('serviceWorker' in navigator)) {
            alert('❌ Service workers are not supported on this app, Please contact support team.');
            toast({
                    title: "Error",
                    description: "❌ Service workers are not supported on this app, Please contact support team.",
                    variant: "destructive",
                })
            return false;
        }
        if (!('PushManager' in window)) {
            alert('❌ Push notifications are not supported on this app, Please contact support team.');
            toast({
                    title: "Error",
                    description: "❌ Push notifications are not supported on this app, Please contact support team.",
                    variant: "destructive",
                })
            return false;
        }
        console.log("hit subs11");
        const registration = await navigator.serviceWorker.register('/sw.js');

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: "BAc-mxt5YMzEkGC5aF1dUQ5n0pL_y51IzdO5jXOoaGSjSXcd5OhWBd05sRb28njnF2xORneihyZoHB7cm4BS_VQ"
            // urlBase64ToUint8Array("BNoCJ9EsZTsNyxtdOpwiCFIknD3Acr_bcxW6bycN5ib7xJ7SSJMKbTHlrK8gubKhMNmz6_dLBgxFoOsbcFzetDc" || process.env.NEXT_PUBLIC_VAPID_KEY)
        });

        return saveSubscrptionMutation.mutate({ userId, subscription }, {
            onSuccess: (res) => {
                toast({
                    title: "Success",
                    description: "Subscribed For Notification update",
                })
                window.location.reload(); // to trigger middleware check
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "failed Subscribed For Notification update, Please contact support team",
                    variant: "destructive",
                })
                window.location.reload(); // to trigger middleware check
            }
        })

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
        // Wait for service worker to be ready
        const registration = await navigator.serviceWorker.ready;

        // Check if there's an existing subscription
        const existingSubscription = await registration.pushManager.getSubscription();

        // If yes, unsubscribe from it
        if (existingSubscription) {
            console.log('Unsubscribing old push subscription...');
            deleteSubscrptionMut.mutate({ endpoint: existingSubscription.endpoint }, {
                onSuccess: async () => {
                    await existingSubscription.unsubscribe();
                    window.location.reload(); // to trigger middleware check
                },
                onError: () => {
                    toast({
                        title: "Error",
                        description: "unable to unsubcribe notification",
                    })
                    window.location.reload(); // to trigger middleware check
                }
            })
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
