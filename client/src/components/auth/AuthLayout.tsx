import type { ReactNode } from 'react';
import { NavBar } from '../layout/NavBar';
import { primaryGradient } from '@/theme';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className={`flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8 ${primaryGradient} bg-cover bg-center`}>
        <div className="w-full max-w-md">
          <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden">
            <div className="px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600">
              <h1 className="text-2xl font-bold text-white text-center py-2">DYPSE</h1>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                {description && (
                  <p className="text-sm text-gray-600">{description}</p>
                )}
              </div>
              
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
