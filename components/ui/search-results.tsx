import React from 'react';
import Link from 'next/link';
import { Loader2, AlertCircle, Search } from 'lucide-react';

// Types pour les résultats de recherche
type Badge = {
  id: number;
  name: string;
  icon?: string | null;
  description?: string | null;
};

type Challenge = {
  id: number;
  name: string;
  description?: string | null;
  difficulty?: string | null;
};

type Page = {
  title: string;
  path: string;
};

interface SearchResultsProps {
  isOpen: boolean;
  badges: Badge[];
  challenges: Challenge[];
  pages: Page[];
  isLoading: boolean;
  error?: string;
  onClose: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  isOpen,
  badges,
  challenges,
  pages,
  isLoading,
  error,
  onClose,
}) => {
  if (!isOpen) return null;

  // Fonction pour fermer le dropdown lorsqu'on clique sur un lien
  const handleItemClick = () => {
    onClose();
  };

  const hasResults = badges.length > 0 || challenges.length > 0 || pages.length > 0;

  return (
    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#160E1E] border border-[#1d1d1d] rounded-md shadow-lg max-h-96 overflow-y-auto">
      {isLoading ? (
        <div className="p-6 text-center text-neutral-400">
          <Loader2 className="animate-spin mx-auto mb-2 h-6 w-6 text-violet-500" />
          <span>Recherche en cours...</span>
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-400">
          <AlertCircle className="mx-auto mb-2 h-6 w-6" />
          <span>{error}</span>
        </div>
      ) : !hasResults ? (
        <div className="p-6 text-center text-neutral-400">
          <Search className="mx-auto mb-2 h-6 w-6 opacity-60" />
          <span>Aucun résultat trouvé</span>
          <p className="text-xs mt-1 text-neutral-500">Essayez avec des termes différents</p>
        </div>
      ) : (
        <div className="py-2">
          {/* Badges */}
          {badges.length > 0 && (
            <div className="mb-2">
              <div className="px-3 py-1.5 text-xs font-semibold text-violet-400 uppercase tracking-wider bg-violet-900/20">
                Badges
              </div>
              <ul className="divide-y divide-[#1d1d1d]">
                {badges.map((badge) => (
                  <li key={badge.id} className="search-result-item">
                    <Link href={`/badges?highlight=${badge.id}`} onClick={handleItemClick}>
                      <div className="px-4 py-2 hover:bg-violet-900/20 flex items-center transition-colors cursor-pointer outline-none focus:bg-violet-900/30 focus:outline-none">
                        {badge.icon && <span className="text-2xl mr-3">{badge.icon}</span>}
                        <div>
                          <div className="font-medium text-white">{badge.name}</div>
                          {badge.description && (
                            <div className="text-xs text-neutral-400 truncate max-w-xs">
                              {badge.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Challenges */}
          {challenges.length > 0 && (
            <div className="mb-2">
              <div className="px-3 py-1.5 text-xs font-semibold text-violet-400 uppercase tracking-wider bg-violet-900/20">
                Défis
              </div>
              <ul className="divide-y divide-[#1d1d1d]">
                {challenges.map((challenge) => (
                  <li key={challenge.id} className="search-result-item">
                    <Link href={`/defis?highlight=${challenge.id}`} onClick={handleItemClick}>
                      <div className="px-4 py-2 hover:bg-violet-900/20 transition-colors cursor-pointer outline-none focus:bg-violet-900/30 focus:outline-none">
                        <div className="font-medium text-white">{challenge.name}</div>
                        {challenge.description && (
                          <div className="text-xs text-neutral-400 truncate max-w-xs">
                            {challenge.description}
                          </div>
                        )}
                        {challenge.difficulty && (
                          <div className="mt-1">
                            <span className="inline-block px-2 py-0.5 text-xs bg-violet-900/30 text-violet-300 rounded-full">
                              {challenge.difficulty}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pages */}
          {pages.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-xs font-semibold text-violet-400 uppercase tracking-wider bg-violet-900/20">
                Pages
              </div>
              <ul className="divide-y divide-[#1d1d1d]">
                {pages.map((page) => (
                  <li key={page.path} className="search-result-item">
                    <Link href={page.path} onClick={handleItemClick}>
                      <div className="px-4 py-2 hover:bg-violet-900/20 transition-colors cursor-pointer outline-none focus:bg-violet-900/30 focus:outline-none">
                        <div className="font-medium text-white">{page.title}</div>
                        <div className="text-xs text-neutral-400">{page.path}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults; 