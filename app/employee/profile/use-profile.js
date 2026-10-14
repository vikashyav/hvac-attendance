"use client"
import { useNotificationModalContext } from "@/components/notification-modal/provider"
import { useMutation } from "@tanstack/react-query"
import { changePassword } from "@/lib/api/auth"
import { useUserFromStorage } from "@/hooks/user.context"
import { useSearchParams } from "next/navigation"
import generateContext from "@/utils/generate-context"

export function useUserProfile() {
    const notificationModal = useNotificationModalContext()
    const { handleLogout } = useUserFromStorage()
    const searchParams = useSearchParams()
    const mutation = useMutation({ mutationFn: changePassword })
    const handleChangePassword = async (payload) => {
        notificationModal.progress({ heading: "Updating password…" })
        try {
            await mutation.mutateAsync(payload)
            notificationModal.success({ heading: "Password updated", body: "Please sign in with your new password." })
            setTimeout(() => handleLogout(), 1000)
        } catch (error) {
            notificationModal.error({ heading: "Password update failed", body: "Check your current password and try again." })
        }
    }
    return { handleChangePassword, queryParmas: { acive_tab: searchParams?.get("acive_tab") } }
}

export const [UserProfileProvider, useUserProfilePageContext] = generateContext(useUserProfile)
