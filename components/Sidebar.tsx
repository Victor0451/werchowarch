import Link from 'next/link';
import { Home, Users, Settings, LayoutDashboard } from 'lucide-react';

const menuItems = [
  { href: '/', label: 'Inicio', icon: LayoutDashboard },
  { href: '/socios', label: 'Socios', icon: Users },
  // { href: '/settings', label: 'Configuración', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-gray-800 text-white hidden md:flex md:flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700">
        <span>Gestion de Archivos</span>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.href} className="mb-2">
              <Link href={item.href}>
                <div className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200">
                  <item.icon className="h-5 w-5 mr-4" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <p className="text-sm text-gray-500">© 2025 Gestion de Archivos</p>
      </div>
    </aside>
  );
}