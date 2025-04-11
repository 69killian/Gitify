import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
  // Récupérer la session de l'utilisateur
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json(
      { error: "Non autorisé. Veuillez vous connecter." },
      { status: 401 }
    );
  }

  // Définir la période pour laquelle récupérer les contributions (par exemple, l'année dernière)
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  // Formater les dates pour GraphQL
  const fromDate = oneYearAgo.toISOString();
  const toDate = today.toISOString();

  // Construire la requête GraphQL
  const query = `
    query {
      viewer {
        contributionsCollection(from: "${fromDate}", to: "${toDate}") {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                color
                weekday
              }
            }
          }
        }
      }
    }
  `;

  try {
    // Exécuter la requête vers l'API GitHub
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: "Erreur lors de l'appel à l'API GitHub", details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des contributions:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des contributions" },
      { status: 500 }
    );
  }
} 