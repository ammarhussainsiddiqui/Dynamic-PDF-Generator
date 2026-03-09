import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { LogOut, FileText } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <nav className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex items-center space-x-2 text-blue-600 font-bold text-xl">
              <FileText className="w-6 h-6" />
              <span>Fast PDF</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 text-sm hidden sm:block">{session.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="p-2 text-gray-500 hover:text-red-600 transition"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
