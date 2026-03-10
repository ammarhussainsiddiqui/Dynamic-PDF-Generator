import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-mono text-xs opacity-60">
          © {new Date().getFullYear()} Fast PDF. All rights reserved.
        </p>
        <div className="flex gap-6 font-mono text-xs opacity-60">
          <Link href="/privacy" className="hover:opacity-100 transition-opacity">Privacy Policy</Link>
          <Link href="/terms" className="hover:opacity-100 transition-opacity">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
