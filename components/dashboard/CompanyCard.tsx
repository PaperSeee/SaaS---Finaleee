import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Company = {
  id: string;
  name: string;
  created_at: string;
  logo_url?: string;
  review_count?: number;
  average_rating?: number;
};

type CompanyCardProps = {
  company: Company;
};

export default function CompanyCard({ company }: CompanyCardProps) {
  // Format date en français
  const formattedDate = format(new Date(company.created_at), 'dd MMMM yyyy', { locale: fr });
  
  // Valeurs par défaut pour les statistiques
  const reviewCount = company.review_count || 0;
  const averageRating = company.average_rating || 0;

  return (
    <div className="block rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center">
        {company.logo_url ? (
          <img 
            src={company.logo_url} 
            alt={company.name} 
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-medium text-blue-600">
            {company.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="ml-4">
          <h3 className="font-medium">{company.name}</h3>
          <p className="text-sm text-gray-500">Ajoutée le {formattedDate}</p>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between border-t pt-4">
        <div>
          <p className="text-sm font-medium text-gray-700">{reviewCount} avis</p>
        </div>
        <div className="flex items-center">
          <span className="mr-1 font-medium">{averageRating.toFixed(1)}</span>
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <Link
          href={`/dashboard/businesses/${company.id}`}
          className="flex-1 rounded-md bg-gray-100 px-3 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Détails
        </Link>
        <Link
          href={`/dashboard/businesses/${company.id}/reviews`}
          className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
        >
          Voir les avis
        </Link>
      </div>
    </div>
  );
}
