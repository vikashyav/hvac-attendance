// utils/subscribeForPush.js
import { useMutation, useQuery } from "@tanstack/react-query"
import { saveSubscrption } from "@/lib/api/dashboard-api";
// import { useToast } from "@/hooks/use-toast"

export async function subscribeForPush(userId) {
    console.log("hit subs11");
    // const { toast } = useToast()
    const saveSubscrptionMutation = useMutation({
        mutationFn: saveSubscrption,
    })


    const registration = await navigator.serviceWorker.register('/sw.js');

    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: "BAc-mxt5YMzEkGC5aF1dUQ5n0pL_y51IzdO5jXOoaGSjSXcd5OhWBd05sRb28njnF2xORneihyZoHB7cm4BS_VQ"
        // urlBase64ToUint8Array("BNoCJ9EsZTsNyxtdOpwiCFIknD3Acr_bcxW6bycN5ib7xJ7SSJMKbTHlrK8gubKhMNmz6_dLBgxFoOsbcFzetDc" || process.env.NEXT_PUBLIC_VAPID_KEY)
    });

    //   await fetch('http://localhost:5000/subscribe', {
    //     method: 'POST',
    //     body: JSON.stringify({ userId, subscription }),
    //     headers: { 'Content-Type': 'application/json' }
    //   });

    await saveSubscrptionMutation.mutate({ userId, subscription }, {
        onSuccess: (res) => {
            alert({
                title: "Success",
                description: "Subscribed For Notification update",
            })
        },
        onError: () => {
            alert({
                title: "Error",
                description: "failed Something went wrong!!!",
            })
        }
    })

}


export async function resetAndSubscribe(userId) {
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


// helper
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
