import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();
    
    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token et mot de passe requis' },
        { status: 400 }
      );
    }
    
    if (typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }
    
    // Créer un client avec la clé publique
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Mettre à jour le mot de passe
    const { error } = await supabase.auth.updateUser({ 
      password: password 
    });

    if (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      return NextResponse.json(
        { error: error.message || 'Échec de la réinitialisation du mot de passe' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Mot de passe réinitialisé avec succès' 
    });
    
  } catch (error) {
    console.error('Erreur de serveur:', error);
    return NextResponse.json(
      { error: 'Une erreur s\'est produite lors de la réinitialisation du mot de passe' },
      { status: 500 }
    );
  }
}
