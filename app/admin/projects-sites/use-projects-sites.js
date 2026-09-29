"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { projectsSitesRegistration, projectsSitesUpdate, getProjectsSitesList } from "@/lib/api/projects-sites-api"
import { useCapabilities } from "@/hooks/use-capabilities"
import { useUserFromStorage } from "@/hooks/user.context"
import generateContext from "@/utils/generate-context"
import { getIntialValues } from "./form-helper"

const errorMessage = (error) => error?.response?.data?.error || "Unable to save the project. Please try again."

export function useProjectsSites() {
  const { user } = useUserFromStorage()
  const capabilities = useCapabilities()
  const canManage = capabilities.isSuccess && (capabilities.data?.data?.data?.permissions || []).includes("project.manage")
  const client = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false)
  const [selectedProjectsSites, setSelectedProjectsSites] = useState(getIntialValues({}))
  const [saveError, setSaveError] = useState("")
  const [saveSuccess, setSaveSuccess] = useState("")
  const scope = `${user.id || ""}:${user.companyId || ""}`
  const [editorScope, setEditorScope] = useState(scope)

  const projects = useQuery({
    queryKey: ["useProjectsSites", user.id, user.companyId],
    queryFn: ({ signal }) => getProjectsSitesList({ signal }),
    enabled: !!user.id,
    retry: false,
  })
  const filteredProjectsSites = (projects.data?.data || []).filter((site) => {
    const matchesSearch = [site.name, site.clientName, site.address].some(value => value?.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesSearch && (statusFilter === "all" || site.status === statusFilter)
  })
  const mutation = useMutation({
    mutationFn: (values) => values.id ? projectsSitesUpdate(values) : projectsSitesRegistration(values),
  })

  useEffect(() => {
    if (!canManage || editorScope !== scope) setIsAddDrawerOpen(false)
  }, [canManage, editorScope, scope])

  const openEditDialog = (site) => {
    if (!canManage) return
    setSelectedProjectsSites(getIntialValues({ ...site }))
    setEditorScope(scope)
    setSaveError("")
    setSaveSuccess("")
    setIsAddDrawerOpen(true)
  }

  const handleAddProjectsSites = async (values, { setSubmitting, resetForm }) => {
    if (!canManage || editorScope !== scope) {
      setSaveError("You do not have permission to manage projects.")
      setSubmitting(false)
      return
    }
    setSaveError("")
    setSaveSuccess("")
    try {
      await mutation.mutateAsync(values)
      resetForm()
      setIsAddDrawerOpen(false)
      setSaveSuccess(`${values.name} ${values.id ? "updated" : "created"} successfully.`)
      // Refresh project selectors as well as the current company list.
      await client.invalidateQueries({ queryKey: ["useProjectsSites"] })
    } catch (error) {
      setSaveError(errorMessage(error))
      if (error?.response?.status === 403) await capabilities.refetch()
    } finally {
      setSubmitting(false)
    }
  }

  return {
    searchQuery, setSearchQuery, statusFilter, setStatusFilter,
    isAddDrawerOpen: isAddDrawerOpen && canManage && editorScope === scope,
    setIsAddDrawerOpen, selectedProjectsSites, filteredProjectsSites,
    handleAddProjectsSites, openEditDialog, canManage, capabilities,
    saveError, saveSuccess, projects,
  }
}

export const [ProjectsSitesPageProvider, useProjectsSitesPageContext] = generateContext(useProjectsSites)
