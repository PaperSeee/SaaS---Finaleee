import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Adresse e-mail requise' },
        { status: 400 }
      );
    }
    
    // Créer un client avec la clé publique (pas besoin de service_role ici)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Envoyer le lien de réinitialisation
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    });

    // Si une erreur se produit avec Supabase
    if (error) {
      console.error('Erreur lors de la demande de réinitialisation:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Ne jamais confirmer si l'email existe ou non pour des raisons de sécurité
    return NextResponse.json({ 
      success: true,
      message: 'Si cette adresse e-mail est associée à un compte, vous recevrez un lien pour réinitialiser votre mot de passe.' 
    });
    
  } catch (error) {
    console.error('Erreur de serveur:', error);
    return NextResponse.json(
      { error: 'Une erreur s\'est produite lors de la demande de réinitialisation' },
      { status: 500 }
    );
  }
}
