import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Obtener los parámetros de la URL de la solicitud entrante
  const searchParams = request.nextUrl.searchParams;
  const f = searchParams.get("f");
  const valor = searchParams.get("valor");
  const port = searchParams.get("port");

  if (!f || !valor || !port) {
    return NextResponse.json(
      {
        message:
          "Parámetros de búsqueda insuficientes (f, valor, port son requeridos).",
      },
      { status: 400 }
    );
  }

  try {
    // Construir la URL base dinámicamente con el puerto recibido
    const baseURL = `http://190.231.67.172:${port}/api/socios`;

    // Construimos los parámetros para la API externa de forma explícita,
    // discriminando por el valor de 'f'.
    const externalApiParams = new URLSearchParams();
    externalApiParams.append("f", f);
    if (f === "maestro") {
      externalApiParams.append("dni", valor);
    } else {
      externalApiParams.append("ficha", valor);
    }

    const apiResponse = await fetch(
      `${baseURL}?${externalApiParams.toString()}`
    );

    if (!apiResponse.ok) {
      // Reenviar el estado de error de la API externa
      const errorBody = await apiResponse.text();
      return NextResponse.json(
        {
          message: `Error desde la API externa: ${apiResponse.statusText}`,
          details: errorBody,
        },
        { status: apiResponse.status }
      );
    }

    const textData = await apiResponse.text();
    const data = textData ? JSON.parse(textData) : [];

    // Reenviar la respuesta exitosa al cliente
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en el proxy de API:", error);
    return NextResponse.json(
      { message: "Error interno del servidor al contactar la API externa." },
      { status: 500 }
    );
  }
}
