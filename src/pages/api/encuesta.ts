import type { APIRoute } from 'astro';
import { pool } from '../../lib/db';

export const prerender = false;

const campos = ['tiempo', 'presentacion', 'mesero', 'sabor'];

function responder(datos: object, status = 200) {
  return new Response(JSON.stringify(datos), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const datos = await request.json();

    const notas = campos.map((c) => Number(datos[c]));
    const validas = notas.every((n) => Number.isInteger(n) && n >= 1 && n <= 5);
    if (!validas) {
      return responder({ ok: false, error: 'Calificaciones inválidas' }, 400);
    }

    const mejorar = String(datos.mejorar ?? '').trim().slice(0, 1000);

    await pool.query(
      'INSERT INTO encuestas (tiempo, presentacion, mesero, sabor, mejorar) VALUES (?, ?, ?, ?, ?)',
      [...notas, mejorar]
    );

    return responder({ ok: true });
  } catch (error) {
    console.error('Error al guardar la encuesta:', error);
    return responder({ ok: false, error: 'Error del servidor' }, 500);
  }
};