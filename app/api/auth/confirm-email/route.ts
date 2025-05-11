import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email } = await request.json();
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    // Créer un client avec la clé service_role
    // REMARQUE: Cette clé ne doit être utilisée que côté serveur
    const serviceRoleSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Rechercher l'utilisateur
    const { data: userData, error: userError } = await serviceRoleSupabase.auth.admin.getUserByEmail(email);
    
    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 });
    }
    
    if (userData?.user) {
      // Confirmer l'email de l'utilisateur
      await serviceRoleSupabase.auth.admin.updateUserById(
        userData.user.id,
        { email_confirmed: true }
      );
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
