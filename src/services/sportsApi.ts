import axios from 'axios';

// ============================================================================
// FOOTBALL DATA API INTEGRATION
// Documentation: https://www.football-data.org/documentation/quickstart
// ============================================================================

/**
 * Football Data API Configuration
 * 
 * Required API Credentials:
 * 1. API Key from football-data.org
 * 
 * How to get credentials:
 * 1. Register at https://www.football-data.org/client/register
 * 2. Get your API key from your account
 * 3. Add the API key to your .env file:
 *    VITE_SPORTS_API_KEY=your_api_key_here
 */

const API_KEY = import.meta.env?.VITE_SPORTS_API_KEY;
const BASE_URL = 'https://api.football-data.org/v4';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Auth-Token': API_KEY
  }
});

export interface Match {
  id: string;
  homeTeam: {
    name: string;
    crest: string;
  };
  awayTeam: {
    name: string;
    crest: string;
  };
  competition: {
    name: string;
    emblem: string;
  };
  utcDate: string;
  status: string;
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
  odds: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
}

export interface Prediction {
  matchId: string;
  prediction: string;
  confidence: number;
  analysis: {
    homeForm: string;
    awayForm: string;
    h2h: string;
    keyStats: string[];
    verdict: string;
  };
  odds: {
    value: number;
    bookmaker: string;
  };
}

export const fetchUpcomingMatches = async (): Promise<Match[]> => {
  try {
    // Available competitions:
    // 2001: Champions League
    // 2002: Bundesliga
    // 2014: Primera Division
    // 2015: Ligue 1
    // 2019: Serie A
    // 2021: Premier League
    const response = await api.get('/matches', {
      params: {
        dateFrom: new Date().toISOString().split('T')[0],
        dateTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        competitions: '2001,2002,2014,2015,2019,2021', // Top leagues
        status: 'SCHEDULED'
      }
    });
    
    // Ensure we only return serializable data
    return response.data.matches.map((match: any) => ({
      id: match.id,
      homeTeam: {
        name: match.homeTeam.name,
        crest: match.homeTeam.crest
      },
      awayTeam: {
        name: match.awayTeam.name,
        crest: match.awayTeam.crest
      },
      competition: {
        name: match.competition.name,
        emblem: match.competition.emblem
      },
      utcDate: match.utcDate,
      status: match.status,
      score: {
        fullTime: {
          home: match.score?.fullTime?.home ?? null,
          away: match.score?.fullTime?.away ?? null
        }
      },
      odds: {
        homeWin: match.odds?.homeWin ?? 1.0,
        draw: match.odds?.draw ?? 1.0,
        awayWin: match.odds?.awayWin ?? 1.0
      }
    }));
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
};

export const fetchMatchPrediction = async (matchId: string): Promise<Prediction | null> => {
  try {
    // In a real app, this would call your ML model or prediction service
    // For now, we'll return mock data
    return {
      matchId,
      prediction: 'BTTS & Over 2.5',
      confidence: 85,
      analysis: {
        homeForm: 'Won 4 of last 5 matches',
        awayForm: 'Unbeaten in last 6 away games',
        h2h: 'Last 3 meetings: 2 wins, 1 draw',
        keyStats: [
          'Both teams scored in 80% of recent matches',
          'Average of 3.2 goals per game',
          'Strong attacking performance from both sides'
        ],
        verdict: 'High-scoring match expected with both teams likely to score'
      },
      odds: {
        value: 1.95,
        bookmaker: 'Bet365'
      }
    };
  } catch (error) {
    console.error('Error fetching prediction:', error);
    return null;
  }
};