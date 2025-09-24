import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function LeaveRequestCardSkeleton({ isAdmin }) {
  return (
    <Card className="hover:shadow-md transition-shadow animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {isAdmin ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div>
                <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
          <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Email / Leave Type / Date Range */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
          </div>
          <div className="h-4 w-28 bg-gray-200 rounded"></div>
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Reason */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div className="space-y-3">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
            <div className="h-16 w-full bg-gray-200 rounded"></div>
            <div className="flex gap-2 pt-2">
              <div className="h-8 flex-1 bg-gray-200 rounded"></div>
              <div className="h-8 flex-1 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
