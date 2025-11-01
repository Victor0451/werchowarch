import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyToken(token: string) {
  if (!SECRET_KEY) {
    console.error("La clave secreta JWT_SECRET no está definida.");
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    console.log("Token inválido o expirado");
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get("werchow-token");

  const publicRoutes = ["/login", "/"];
  const isPublicRoute = publicRoutes.includes(pathname);

  const session = tokenCookie ? await verifyToken(tokenCookie.value) : null;

  // Si el usuario está autenticado y visita una ruta pública (como /login)
  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL("/socios", request.url));
  }

  // Si el usuario no está autenticado e intenta acceder a una ruta protegida
  if (!session && !isPublicRoute) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    // Si había una cookie inválida, la eliminamos
    if (tokenCookie) {
      response.cookies.delete("werchow-token");
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Aplica el proxy a todas las rutas excepto las que empiezan por:
  // - api (rutas de API)
  // - _next/static (archivos estáticos)
  // - _next/image (imágenes optimizadas)
  // - favicon.ico (el ícono de la pestaña)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};