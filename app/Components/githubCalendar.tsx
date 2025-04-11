"use client";

import React from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";

// Types pour organiser les données
type ContributionDay = {
  date: string;
  contributionCount: number;
  color: string;
  weekday: number;
};

type ContributionWeek = {
  contributionDays: ContributionDay[];
};

// Type pour les données de jour traitées
type ProcessedDay = {
  date: string;
  count: number;
  color: string;
  weekday: number;
};

// Fetcher function pour SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Erreur API");
  }
  return res.json();
};

const GitHubCalendar = () => {
  const { status } = useSession();
  const { data, error, isLoading } = useSWR(
    status === "authenticated" ? "/api/github-calendar" : null,
    fetcher
  );

  // Les données transformées du calendrier
  const contributionData = data?.data?.viewer?.contributionsCollection?.contributionCalendar;

  // Fonction pour convertir les données
  const getContributionCells = (): ProcessedDay[] => {
    if (!contributionData) return [];
    
    return contributionData.weeks.flatMap((week: ContributionWeek) => 
      week.contributionDays.map((day: ContributionDay) => ({
        date: day.date,
        count: day.contributionCount,
        color: day.color,
        weekday: day.weekday
      }))
    );
  };

  // Affichage pendant le chargement
  if (isLoading) {
    return (
      <div className="bg-[#241730] transition-all overflow-hidden duration-200 w-full h-[250px] rounded-[6px] border border-1 border-[#292929] flex justify-center items-center">
        <p className="text-white">Chargement de vos contributions...</p>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="bg-[#241730] transition-all overflow-hidden duration-200 w-full h-[250px] rounded-[6px] border border-1 border-[#292929] flex justify-center items-center">
        <p className="text-red-400">Impossible de charger les contributions. Veuillez réessayer plus tard.</p>
      </div>
    );
  }

  // Rendu du calendrier avec données réelles
  const contributionCells = getContributionCells();
  // Inverser l'ordre des cellules pour qu'elles avancent vers la droite
  const reversedCells = [...contributionCells].reverse();

  return (
    <div className="bg-[#241730] transition-all duration-200 w-full h-[250px] rounded-[6px] border border-1 border-[#292929] flex justify-center items-center overflow-hidden">
      {/* Conteneur avec défilement horizontal uniquement */}
      <div className="overflow-x-auto overflow-y-hidden h-[250px] w-full flex items-center pl-5">
        {/* Conteneur fixe pour la grille */}
        <div className="grid grid-cols-7 gap-1 rotate-90 py-4 px-6 min-w-max mx-auto">
          {reversedCells.map((day: ProcessedDay, index: number) => (
            <div
              key={index}
              title={`${new Date(day.date).toLocaleDateString()} - ${day.count} contributions`}
              className={`w-[25px] h-[25px] ${
                getColorClass(day.count)
              } rounded-md hover:scale-110 transition-transform cursor-pointer`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Fonction utilitaire pour déterminer la classe de couleur selon le nombre de contributions
const getColorClass = (count: number) => {
  if (count === 0) return "bg-[#160E1E]";
  if (count < 5) return "bg-violet-900";
  if (count < 10) return "bg-violet-800";
  if (count < 15) return "bg-violet-700";
  return "bg-violet-600";
};

export default GitHubCalendar;
