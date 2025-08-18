"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useNotificationModalContext } from "@/components/notification-modal/provider"
import { useMutation, useQuery } from "@tanstack/react-query"
import { changePassword } from "@/lib/api/auth";
import _ from "lodash";
import { useUserFromStorage } from "@/hooks/user.context"
import { useSearchParams } from "next/navigation"
import generateContext from "@/utils/generate-context"
// import { formatTimeDifference } from "@/utils/helper";
// import { getEmployeeDashboardStats } from "@/lib/api/dashboard-api";




export function useUserProfile() {
    const notificationModal = useNotificationModalContext();
    const {handleLogout}= useUserFromStorage();
    const searchParams = useSearchParams()//.getAll();
    
    const changePasswordMutFn = useMutation({
        mutationFn: changePassword,
    })
  const [queryParmas, setQueryParmas]= useState({})

useEffect(()=>{
  searchParams.forEach((value, key) => {
  setQueryParmas({...queryParmas, [key]: value})
})
},[])
    const handleChangePassword = (payload) => {
        notificationModal.progress({
            heading: `Please await!!`,
        });
        changePasswordMutFn.mutate(payload, {
            onSuccess: () => {
                notificationModal.success({ heading: "Success", body: `Please login with your new password` });
                setTimeout(() => {
                handleLogout();
                }, 1000);
            },
            onError: () => {
                notificationModal.error({ heading: "failed Something went wrong!!!", body: JSON.stringify(err) });
            }
        })
    }
    return {
        handleChangePassword, queryParmas
    }
}

export const [UserProfileProvider, useUserProfilePageContext] = generateContext(useUserProfile);
