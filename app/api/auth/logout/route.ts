import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    (await cookies()).delete("werchow-token");
    return NextResponse.json({ message: "Sesión cerrada con éxito." });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return NextResponse.json(
      { message: "Error en el servidor." },
      { status: 500 }
    );
  }
}
