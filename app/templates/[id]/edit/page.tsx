import { connectToDatabase } from "@/lib/db";
import Template from "@/lib/models/Template";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import TemplateEditor from "@/components/TemplateEditor";

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const session: any = await auth();
  if (!session) redirect("/");

  const { id } = await params;

  await connectToDatabase();
  const template = await Template.findOne({ _id: id, userId: (session.user as any).id });

  if (!template) {
    redirect("/dashboard");
  }

  // Passing lean object to client component
  const plainTemplate = {
    _id: template._id.toString(),
    name: template.name,
    htmlContent: template.htmlContent,
    cssContent: template.cssContent,
    sampleJson: template.sampleJson,
    sizeKey: template.sizeKey,
    pageSize: template.pageSize ? {
      width: template.pageSize.width,
      height: template.pageSize.height,
    } : undefined,
    googleFonts: template.googleFonts || [],
  };

  return <TemplateEditor initialTemplate={plainTemplate} />;
}
