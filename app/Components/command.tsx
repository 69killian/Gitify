"use client";

import { Search, Loader2, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import SearchResults from "@/components/ui/search-results";

interface SearchResult {
  badges: {
    id: number;
    name: string;
    icon?: string | null;
    description?: string | null;
  }[];
  challenges: {
    id: number;
    name: string;
    description?: string | null;
    difficulty?: string | null;
  }[];
  pages: {
    title: string;
    path: string;
  }[];
}

export function CommandDemo() {
  // État pour la valeur de recherche
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 300);

  // États pour les résultats et le chargement
  const [results, setResults] = useState<SearchResult>({
    badges: [],
    challenges: [],
    pages: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  // Référence pour détecter les clics en dehors du dropdown
  const searchRef = useRef<HTMLDivElement>(null);

  // Effectuer la recherche lorsque la valeur debouncée change
  useEffect(() => {
    // Si la valeur de recherche est vide, on réinitialise et ferme le dropdown
    if (!debouncedSearchValue.trim()) {
      setResults({ badges: [], challenges: [], pages: [] });
      setIsOpen(false);
      return;
    }

    // Si l'utilisateur tape quelque chose, on ouvre le dropdown immédiatement pour montrer le chargement
    setIsOpen(true);
    setIsLoading(true);
    setError(undefined);

    
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedSearchValue)}`);
        
        if (!response.ok) {
          // {{ edit_1: Updated error handling to safely parse the error response }}
          let errorMessage = "Une erreur est survenue lors de la recherche.";
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (parseError) {
            errorMessage = await response.text() || errorMessage;
          }
          throw new Error(errorMessage);
          // {{ edit_1: End update }}
        }

        const data = await response.json();
        setResults(data);
      } catch (err) {
        console.error("Erreur lors de la recherche:", err);
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearchValue]);

  // Gérer les clics en dehors du dropdown pour le fermer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Gérer les touches pour la navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      // Focus le premier élément du dropdown
      const firstResult = document.querySelector(".search-result-item") as HTMLElement;
      if (firstResult) {
        e.preventDefault();
        firstResult.focus();
      }
    }
  };

  // Ouvrir le dropdown quand l'utilisateur commence à taper
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    
    // Si l'utilisateur tape quelque chose, on ouvre le dropdown immédiatement
    if (value.trim()) {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative rounded-lg shadow-md xl:w-[681.16px]" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          className="w-full min-w-0 py-2 h-[40px] pl-10 pr-10 bg-[#160E1E] text-white text-sm rounded-md border border-[#1d1d1d] placeholder:text-neutral-500 focus:ring-2 focus:ring-violet-700 outline-none transition-all duration-200"
          placeholder="Rechercher un Badge, un défi, une page..."
          value={searchValue}
          onChange={handleInputChange}
          onFocus={() => {
            // Ouvrir le dropdown si l'utilisateur a déjà tapé quelque chose
            if (searchValue.trim()) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          aria-label="Recherche"
          aria-expanded={isOpen}
          role="combobox"
          autoComplete="off"
        />
        {isLoading ? (
          <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-500 w-5 md:w-6 animate-spin" />
        ) : (
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 w-5 md:w-6" />
        )}

        {/* Bouton pour effacer la recherche */}
        {searchValue && (
          <button
            type="button"
            onClick={() => {
              setSearchValue("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
            aria-label="Effacer la recherche"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Résultats de recherche */}
      <SearchResults
        isOpen={isOpen}
        badges={results.badges}
        challenges={results.challenges}
        pages={results.pages}
        isLoading={isLoading}
        error={error}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
