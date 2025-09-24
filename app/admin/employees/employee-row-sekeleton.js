import { TableRow, TableCell } from "@/components/ui/table";

export function EmployeeRowSkeleton() {
  return (
    <TableRow className="animate-pulse">
      {/* Name + Email */}
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div>
            <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
            <div className="h-3 w-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </TableCell>

      {/* Department */}
      <TableCell>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </TableCell>

      {/* Position */}
      <TableCell>
        <div className="h-4 w-28 bg-gray-200 rounded"></div>
      </TableCell>

      {/* Status Badge */}
      <TableCell>
        <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
      </TableCell>

      {/* Performance Bar */}
      <TableCell>
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2"></div>
          <div className="h-4 w-8 bg-gray-200 rounded"></div>
        </div>
      </TableCell>

      {/* Hire Date */}
      <TableCell>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right">
        <div className="h-8 w-8 bg-gray-200 rounded"></div>
      </TableCell>
    </TableRow>
  );
}
