import Link from "next/link";
import { LayoutDashboard, Users } from "lucide-react";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { sgi } from "@/lib/db";
import { UserMenu } from "./UserMenu";

const menuItems = [
  { href: "/", label: "Inicio", icon: LayoutDashboard },
  { href: "/socios", label: "Socios", icon: Users },
  // { href: '/settings', label: 'Configuración', icon: Settings },
];

async function getUserData() {
  const tokenCookie = (await cookies()).get("werchow-token");
  if (!tokenCookie) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(tokenCookie.value, secret);

    if (!payload.id) return null;

    const userResult = await sgi.query(
      `SELECT nombre, apellido, perfil FROM operador WHERE id = ?`,
      [payload.id]
    );

    const user = Array.isArray(userResult) ? userResult[0] : null;
    if (!user) return null;

    return {
      name: `${user.nombre} ${user.apellido}`,
      profile: user.perfil,
    };
  } catch (e) {
    return null;
  }
}

export async function Sidebar() {
  const user = await getUserData();

  return (
    <aside className="w-64 shrink-0 bg-gray-800 text-white hidden md:flex md:flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700">
        <span>Gestion de Archivos</span>
      </div>
      <nav className="flex-1 px-2 py-4">
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

      {/* User Menu */}
      {user && (
        <div className="px-2 py-4 border-t border-gray-700">{<UserMenu user={user} />}</div>
      )}

      <div className="p-4 border-t border-gray-700 mt-auto">
        <p className="text-xs text-center text-gray-500">
          © 2025 Gestion de Archivos
        </p>
      </div>
    </aside>
  );
}
