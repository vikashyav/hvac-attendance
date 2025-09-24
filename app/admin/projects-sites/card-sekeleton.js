import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function SiteCardSkeleton() {
  return (
    <Card className="hover:shadow-lg transition-shadow animate-pulse">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-5 w-40 bg-gray-200 rounded"></div>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-4 w-56 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Client / Supervisor / Team / Contact */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
              <div className="h-4 w-28 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
            <div className="h-3 w-8 bg-gray-200 rounded"></div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2"></div>
        </div>

        {/* Budget / Spent */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        {/* Date */}
        <div className="flex items-center space-x-2 text-sm">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>

        {/* Description */}
        <div className="h-12 w-full bg-gray-200 rounded"></div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="h-8 w-28 bg-gray-200 rounded"></div>
          <div className="flex space-x-2">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
