"use client"

import { useState } from "react"
import fakeData from "@/constants/fake-data";
import { useToast } from "@/hooks/use-toast"
import { useNotificationModalContext } from "@/components/notification-modal/provider"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { employeeRegistration, employeeUpdate, getEmployeeList } from "@/lib/api/employee";
import generateContext from "@/utils/generate-context";
import { getIntialValues } from "./form-helper";
import { useUserFromStorage } from "@/hooks/user.context";
import { useCapabilities } from "@/hooks/use-capabilities";

export function useEmployees() {
  const { toast } = useToast()
  const notificationModal = useNotificationModalContext();
  const { user } = useUserFromStorage();
  const capabilities = useCapabilities();
  const queryClient = useQueryClient();

  const permissions = capabilities.isSuccess ? capabilities.data?.data?.data?.permissions || [] : [];
  const canManage = permissions.includes('employee.manage') || user?.role === 'superAdmin';
  const canView = permissions.includes('employee.view') || canManage || user?.role === 'admin' || user?.role === 'superAdmin';

  const [view, setView] = useState("table")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(getIntialValues({}))

  const departments = fakeData.departments
  const positions = fakeData.positions
  const locations = fakeData.locations

  const queryKey = ['employees', user?.id, user?.companyId, { is_emp_stats: 1 }];

  const { data: employeeData, isFetching, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: getEmployeeList,
    enabled: !!user && canView,
  });

  const filteredEmployees = (employeeData?.data?.data || []).filter((employee) => {
    const matchesSearch =
      employee?.fullName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      employee?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      employee?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || employee?.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const mutation = useMutation({
    mutationFn: employeeRegistration,
    onSuccess: (res, values) => {
      queryClient.invalidateQueries({ queryKey: ['employees', user?.id, user?.companyId] });
      refetch();
      setIsAddDrawerOpen(false);
      notificationModal.success({ heading: "Success", body: `${values?.firstName || 'Employee'} has been added to your team.` });
    },
    onError: (err) => {
      const msg = err?.response?.data?.error || err?.message || 'Failed to add employee';
      notificationModal.error({ heading: "Adding Employee Failed", body: msg });
    }
  });

  const updateMutation = useMutation({
    mutationFn: employeeUpdate,
    onSuccess: (res, values) => {
      queryClient.invalidateQueries({ queryKey: ['employees', user?.id, user?.companyId] });
      refetch();
      setIsEditDialogOpen(false);
      setIsAddDrawerOpen(false);
      notificationModal.success({ heading: "Success", body: `Employee updated successfully.` });
    },
    onError: (err) => {
      const msg = err?.response?.data?.error || err?.message || 'Failed to update employee';
      notificationModal.error({ heading: "Updating Employee Failed", body: msg });
    }
  });

  const handleAddEmployee = (values, { setSubmitting, resetForm } = {}) => {
    if (!canManage) {
      notificationModal.error({ heading: "Permission Denied", body: "You do not have permission to manage employees." });
      return;
    }
    notificationModal.progress({
      heading: `Saving ${values?.firstName || 'employee'} details, please wait...`,
    });
    const apiCall = values?.id ? updateMutation.mutate : mutation.mutate;
    apiCall(values);
  };

  const handleViewDetails = (employee) => {
    setSelectedEmployee(getIntialValues({ ...employee }));
    setIsEditDialogOpen(false);
    setIsAddDrawerOpen(true);
  };

  const openEditDialog = (employee) => {
    if (!canManage) {
      handleViewDetails(employee);
      return;
    }
    setSelectedEmployee(getIntialValues({ ...employee }));
    setIsEditDialogOpen(true);
    setIsAddDrawerOpen(true);
  };

  return {
    view, setView,
    searchTerm, setSearchTerm,
    selectedDepartment, setSelectedDepartment,
    isAddDrawerOpen, setIsAddDrawerOpen,
    isEditDialogOpen, setIsEditDialogOpen,
    selectedEmployee, setSelectedEmployee,
    departments, positions, locations, filteredEmployees,
    handleAddEmployee, handleViewDetails, openEditDialog,
    employeeData: employeeData?.data,
    isFetching, isLoading, isError, refetch,
    canManage, canView,
    capabilitiesLoading: capabilities.isLoading,
    capabilitiesError: capabilities.isError,
    capabilitiesRefetch: capabilities.refetch,
  };
}

export const [EmployeesPageProvider, useEmployeesPageContext] = generateContext(useEmployees);
