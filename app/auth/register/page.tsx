"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const supabase = createClientComponentClient();

  // Redirection si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Inscription avec Supabase avec l'option data.email_confirm
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            email_confirm: true,  // Changed from email_confirmed for consistency
            company_name: companyName
          }
        }
      });
      
      if (error) {
        setError(error.message || "Une erreur s'est produite lors de l'inscription");
        return;
      }
      
      // Si l'utilisateur a été créé
      if (data?.user) {
        // Stocker les informations complémentaires dans une table Supabase
        if (companyName) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              company_name: companyName,
              email: email,
              created_at: new Date().toISOString()
            });
            
          if (profileError) {
            console.error("Error saving profile:", profileError);
          }
        }
        
        // Si on a déjà une session, rediriger directement
        if (data.session) {
          router.push("/dashboard");
          return;
        }
        
        // Sinon, essayer de se connecter immédiatement
        try {
          const { error: signInError, data: signInData } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (signInError) {
            // Si l'erreur est liée à la confirmation d'email
            if (signInError.message && signInError.message.toLowerCase().includes('confirm')) {
              setError("Email non confirmé. Pour le développement, allez dans le tableau de bord Supabase pour désactiver la vérification d'email.");
              console.info("Pour désactiver la vérification d'email dans Supabase: Authentication > Email Templates > Disable Email Confirmation");
            } else {
              setError(signInError.message);
            }
            return;
          }
          
          if (signInData?.session) {
            router.push("/dashboard");
          }
        } catch (signInErr) {
          console.error("Erreur lors de la connexion après inscription:", signInErr);
          setError("Inscription réussie mais connexion impossible. Veuillez vous connecter manuellement.");
        }
      }
    } catch (err) {
      console.error("Erreur d'inscription:", err);
      setError("Une erreur inattendue s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-8 shadow-md">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Kritiqo"
            width={120}
            height={120}
            className="mx-auto"
          />
          <h2 className="mt-4 text-2xl font-semibold">Créer votre compte</h2>
        </div>
        
        {error && (
          <div className={`rounded-md p-4 text-sm ${error.includes('confirmation') ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="company" className="block text-sm font-medium">
                Nom de l&apos;entreprise
              </label>
              <input
                id="company"
                name="company"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="Nom de votre entreprise"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="Mot de passe (6 caractères minimum)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {loading ? "Création en cours..." : "Créer un compte"}
            </button>
          </div>
        </form>
        
        <div className="text-center text-sm">
          <p>
            Vous avez déjà un compte ?{" "}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
