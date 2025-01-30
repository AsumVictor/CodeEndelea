import { CheckCircle, XCircle } from "lucide-react";

export function PermissionStatus({ icon, name, status }: { icon: React.ReactNode; name: string; status: boolean | null }) {
    return (
      <div className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg">
        {icon}
        <span className="flex-grow">{name}</span>
        {status === null ? (
          <span className="text-yellow-400">Checking...</span>
        ) : status ? (
          <CheckCircle className="w-6 h-6 text-green-400" />
        ) : (
          <XCircle className="w-6 h-6 text-red-400" />
        )}
      </div>
    )
  }