'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '@/types';
import { authService } from '@/services/auth.service';
import { Button } from './ui/Button';
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const currentUser = authService.getUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    router.push('/');
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.INTERESSADO:
        return 'Interessado';
      case UserRole.PROTETOR:
        return 'Protetor';
      case UserRole.ADMIN:
        return 'Administrador';
      default:
        return role;
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Logo defaultColor={true} size="lg" />
              <span className="text-xl font-bold text-gray-900">Patas Amigas</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/pets" className="text-gray-700 hover:text-blue-600 transition-colors">
              Animais
            </Link>
            
            {isClient && user ? (
              <>
                {user.role === UserRole.PROTETOR && (
                  <Link href="/dashboard/protector" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Meus Animais
                  </Link>
                )}
                {user.role === UserRole.ADMIN && (
                  <Link href="/dashboard/admin" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Admin
                  </Link>
                )}
                <Link href="/solicitacoes" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Minhas Solicitações
                </Link>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{user.name}</span>
                    <span className="text-xs text-gray-500">({getRoleLabel(user.role)})</span>
                  </div>
                  <Button size="sm" variant="outline" className='hover:bg-purple-600 hover:text-white' onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-1" />
                    Sair
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button size="sm" variant="outline" className='hover:bg-purple-600 hover:text-white'>
                    Entrar
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className='bg-purple-600 text-white hover:bg-purple-700'>
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
              <Link
                href="/pets"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Animais
              </Link>
              
              {isClient && user ? (
                <>
                  {user.role === UserRole.PROTETOR && (
                    <Link
                      href="/dashboard/protector"
                      className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Meus Animais
                    </Link>
                  )}
                  {user.role === UserRole.ADMIN && (
                    <Link
                      href="/dashboard/admin"
                      className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/solicitacoes"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Minhas Solicitações
                  </Link>
                  
                  <div className="px-3 py-2 border-t border-gray-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <UserIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{user.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 block mb-2">
                      {getRoleLabel(user.role)}
                    </span>
                    <Button size="sm" variant="outline" onClick={handleLogout} className="w-full">
                      <LogOut className="w-4 h-4 mr-1" />
                      Sair
                    </Button>
                  </div>
                </>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" variant="outline" className="w-full">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full">
                      Cadastrar
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
