/*esta es una page.js que se abre por default por el next.js cuando corre http://localhost:3000/
se abre este page.js entonces aqui mismo estoy redigiriendo a la pagina principal que es /user/eventos/lista */
// app/page.js

import { redirect } from 'next/navigation';

export default function RootPage() {
  // Cuando este componente se renderiza (al acceder a /),
  // Next.js inmediatamente redirige al usuario.
  redirect('/auth/login');
  
  // Opcionalmente, puedes retornar null o un fragmento vacío
  // aunque 'redirect' detiene el renderizado.
  // return null; 
}