export function ActivityRowSkeleton({ index }) {
  return (
    <div
      key={index}
      className="flex items-center justify-between p-2 rounded-lg bg-muted/50 animate-pulse"
    >
      {/* Avatar / Photo */}
      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>

      {/* Middle Content */}
      <div className="flex-1 min-w-0 px-3">
        {/* Employee Name */}
        <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>

        {/* Action + Location */}
        <div className="flex gap-2 items-center">
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
          <div className="h-3 flex-1 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Badge + Time */}
      <div className="flex items-center gap-2 ml-4">
        <div className="h-5 w-14 bg-gray-200 rounded-full"></div>
        <div className="h-3 w-12 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export function TaskScheduleRowSkeleton({ index }) {
  return (
    <div
      key={index}
      className="flex items-center justify-between p-2 rounded-lg bg-muted/50 animate-pulse"
    >
      {/* Left Content */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Title + Project/Site */}
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>

        {/* Spacer (subtitle) */}
        <div className="h-3 w-1/2 bg-gray-200 rounded"></div>

        {/* Assign To + Hours + Created By */}
        <div className="h-3 w-full bg-gray-200 rounded"></div>
      </div>

      {/* Date Badge */}
      <div className="h-6 w-20 bg-gray-200 rounded-full ml-4"></div>
    </div>
  );
}
