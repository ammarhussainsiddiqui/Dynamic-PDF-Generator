import { connectToDatabase } from "@/lib/db";
import Template from "@/lib/models/Template";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FileEdit, Plus, Trash2 } from "lucide-react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Dashboard() {
  const session: any = await getServerSession(authOptions as any);
  if (!session) redirect("/");

  await connectToDatabase();
  const templates = await Template.find({ userId: (session.user as any).id }).sort({ updatedAt: -1 });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
          <p className="text-gray-500 mt-1">Manage your PDF templates</p>
        </div>
        <Link 
          href="/templates/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          <span>New Template</span>
        </Link>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed rounded-lg">
          <FileEdit className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No templates yet</h3>
          <p className="text-gray-500 mt-1 mb-6">Create your first template to start generating PDFs.</p>
          <Link 
            href="/templates/new" 
            className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg font-medium transition inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Template
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(t => (
            <div key={t._id.toString()} className="bg-white border rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
              <div className="p-5 flex-grow">
                <h2 className="font-semibold text-xl text-gray-900 mb-2 truncate">{t.name}</h2>
                <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded truncate">
                  ID: {t._id.toString()}
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Updated {new Date(t.updatedAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <button className="p-1.5 text-red-500 hover:bg-red-50 rounded" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link 
                    href={`/templates/${t._id}/edit`} 
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit"
                  >
                    <FileEdit className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
