import { ImageSourcePropType } from 'react-native/types';

export type RootStackParamsList = {
  Home: undefined;
  Results: {data: Data};
}
export interface FetchError extends Error{
  subMessage: string;
}

type gameType = '1v1' | '2v2' | '3v3' | '4v4' | 'Archon';
export type league =
  | 'BRONZE'
  | 'SILVER'
  | 'GOLD'
  | 'PLATINUM'
  | 'DIAMOND'
  | 'MASTER'
  | 'GRANDMASTER'
  | 'null'
export type race = 'terran' | 'zerg' | 'protoss'| 'random';
export type raceImage = {
  [key in race] : ImageSourcePropType
}
export type leagueImage = {
  [key in league] : ImageSourcePropType
}
export type raceData = {
  [key in race]: {
    leagueName: league;
    wins: number;
    losses: number;
  } | null
};
type snapshot = {
  [key in gameType]: {
    rank: number;
    leagueName: string | null;
    totalGames: number;
    totalWins: number;
  };
};
export interface Data {
  summary: {
    id: string;
    realm: number;
    displayName: string;
    portrait: string;
    decalTerran: string;
    decalProtoss: string;
    decalZerg: string;
    totalSwarmLevel: number;
    totalAchievementPoints: number;
  };
  snapshot: {
    seasonSnapshot: snapshot;
    totalRankedSeasonGamesPlayed: number;
  };
  career: {
    terranWins: number;
    zergWins: number;
    protossWins: number;
    totalCareerGames: number;
    totalGamesThisSeason: number;
    current1v1LeagueName: league;
    currentBestTeamLeagueName: league;
    best1v1Finish: {
      leagueName: league;
      timesAchieved: number;
    };
    bestTeamFinish: {
      leagueName: league;
      timesAchieved: number;
    };
  };
  ladder: {
    showCaseEntries: {
      ladderId: string;
      team: {
        localizedGameMode: gameType;
        members: {
          favoriteRace: race;
          name: string;
          playerId: string;
          region: number;
        }[];
      };
      leagueName: league;
      localizedDivisionName: string;
      rank: number;
      wins: number;
      losses: number;
    }[];
    allLadderMemberships: {
      ladderId: string;
      localizedGameMode: string;
      rank: number;
    }[];
  };
}
export class FetchError{
  constructor(message:string, subMessage:string){
    this.message = message;
    this.subMessage = subMessage
  }
}