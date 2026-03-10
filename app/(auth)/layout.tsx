import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-background relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent opacity-5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent-light opacity-5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        {children}
      </div>
    </div>
  );
}
