import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { sgi } from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { usuario, contrasena } = await req.json();

    if (!usuario || !contrasena) {
      return NextResponse.json(
        { msg: "Usuario y contraseña son requeridos." },
        { status: 400 }
      );
    }

    // Chequear si el usuario existe
    const userResult = await sgi.query(
      `SELECT * FROM operador WHERE usuario = ?`,
      [usuario]
    );

    // serverless-mysql devuelve un array, incluso para un solo resultado.
    const user = Array.isArray(userResult) ? userResult[0] : null;

    if (!user) {
      return NextResponse.json(
        { msg: "Usuario ingresado no existe." },
        { status: 400 }
      );
    }

    if (user.estado === 0) {
      return NextResponse.json(
        { msg: "El usuario se encuentra dado de baja." },
        { status: 400 }
      );
    }

    // Validar contraseña
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);

    if (!isMatch) {
      return NextResponse.json(
        { msg: "Credenciales inválidas." },
        { status: 400 }
      );
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("La clave secreta JWT_SECRET no está definida.");
      return NextResponse.json(
        { msg: "Error de configuración en el servidor." },
        { status: 500 }
      );
    }

    // Crear y firmar el token
    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "8h" });

    // --- Guardar el token en una cookie httpOnly ---
    (await cookies()).set("werchow-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8, // 8 horas
      path: "/",
    });

    // No es necesario devolver toda la información del usuario.
    // El frontend puede guardarla si es necesario, pero el token es lo principal.
    return NextResponse.json({
      // Devolvemos un mensaje de éxito. El token ya está en la cookie.
      message: "Inicio de sesión exitoso.",
      user: {
        id: user.id,
        usuario: user.usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        perfil: user.perfil,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { msg: "Ocurrió un error en el servidor." },
      { status: 500 }
    );
  } finally {
    // En un entorno serverless, es mejor dejar que el driver maneje el pool de conexiones.
    // Si es estrictamente necesario, puedes descomentar la siguiente línea.
    // await sgi.end();
  }
}
