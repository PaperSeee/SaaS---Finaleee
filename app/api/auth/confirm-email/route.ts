import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email } = await request.json();
  // Remove unused cookieStore variable

  try {
    // Créer un client avec la clé service_role
    // REMARQUE: Cette clé ne doit être utilisée que côté serveur
    const serviceRoleSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Rechercher l'utilisateur avec listUsers au lieu de getUserByEmail
    // on cast en any pour bypasser le typage incomplet
    const { data: listData, error: listError } = await serviceRoleSupabase.auth.admin.listUsers(
      { filter: `email=eq.${email}` } as any
    );
    
    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 400 });
    }
    
    if (!listData.users || listData.users.length === 0) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }
    
    const userData = listData.users[0];
    
    // Confirmer l'email de l'utilisateur
    await serviceRoleSupabase.auth.admin.updateUserById(
      userData.id,
      { email_confirm: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
