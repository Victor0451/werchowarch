import { NextResponse } from "next/server";
import { sgi } from "../../../lib/db";

export async function GET() {
  try {
    console.log("Intentando conectar a la base de datos...");
    const result = await sgi.query("SELECT 1 as test");

    // serverless-mysql puede cerrar la conexión automáticamente,
    // pero para un chequeo puntual es bueno cerrarla explícitamente.
    // await sgi.end(); // No cerramos la conexión para que pueda ser reutilizada.

    console.log("Conexión a la base de datos exitosa.");

    return NextResponse.json({
      status: "ok",
      message: "Conexión a la base de datos exitosa.",
      result: result,
    });
  } catch (error: any) {
    console.error("Error al conectar con la base de datos:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error al conectar con la base de datos.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}