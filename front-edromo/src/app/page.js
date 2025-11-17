/*esta es una page.js que se abre por default por el next.js cuando corre http://localhost:3000/
se abre este page.js entonces aqui mismo estoy redigiriendo a la pagina principal que es /user/web/eventos/lista */
// app/page.js

import { redirect } from 'next/navigation';

export default function RootPage() {

  redirect('/user/web/eventos/lista');
  
}