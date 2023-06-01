import {Data} from './types'
export const sampleData: Data = {
  summary: {
    id: '12526931',
    realm: 1,
    displayName: 'DeacsOut',
    portrait:
      'https://static.starcraft2.com/starport/bda9a860-ca36-11ec-b5ea-4bed4e205979/portraits/15-2.jpg',
    decalTerran:
      'https://static.starcraft2.com/starport/bda9a860-ca36-11ec-b5ea-4bed4e205979/decals/4-35.jpg',
    decalProtoss:
      'https://static.starcraft2.com/starport/bda9a860-ca36-11ec-b5ea-4bed4e205979/decals/2-25.jpg',
    decalZerg:
      'https://static.starcraft2.com/starport/bda9a860-ca36-11ec-b5ea-4bed4e205979/decals/4-37.jpg',
    totalSwarmLevel: 112,
    totalAchievementPoints: 1300,
  },
  snapshot: {
    seasonSnapshot: {
      '1v1': {
        rank: 45,
        leagueName: 'GOLD',
        totalGames: 42,
        totalWins: 27,
      },
      '2v2': {
        rank: 10,
        leagueName: 'PLATINUM',
        totalGames: 42,
        totalWins: 24,
      },
      '3v3': {
        rank: -1,
        leagueName: null,
        totalGames: 0,
        totalWins: 0,
      },
      '4v4': {
        rank: -1,
        leagueName: null,
        totalGames: 0,
        totalWins: 0,
      },
      Archon: {
        rank: -1,
        leagueName: null,
        totalGames: 0,
        totalWins: 0,
      },
    },
    totalRankedSeasonGamesPlayed: 84,
  },
  career: {
    terranWins: 27,
    zergWins: 24,
    protossWins: 0,
    totalCareerGames: 972,
    totalGamesThisSeason: 84,
    current1v1LeagueName: 'GOLD',
    currentBestTeamLeagueName: 'PLATINUM',
    best1v1Finish: {
      leagueName: 'GOLD',
      timesAchieved: 1,
    },
    bestTeamFinish: {
      leagueName: 'PLATINUM',
      timesAchieved: 1,
    },
  },
  ladder: {
    showCaseEntries: [
      {
        ladderId: '315225',
        team: {
          localizedGameMode: '1v1',
          members: [
            {
              favoriteRace: 'terran',
              name: 'DeacsOut',
              playerId: '12526931',
              region: 1,
            },
          ],
        },
        leagueName: 'SILVER',
        localizedDivisionName: 'Talematros Victor',
        rank: 27,
        wins: 20,
        losses: 7,
      },
      {
        ladderId: '315297',
        team: {
          localizedGameMode: '1v1',
          members: [
            {
              favoriteRace: 'zerg',
              name: 'DeacsOut',
              playerId: '12526931',
              region: 1,
            },
          ],
        },
        leagueName: 'GOLD',
        localizedDivisionName: 'Torrasque Eta',
        rank: 45,
        wins: 7,
        losses: 8,
      },
      {
        ladderId: '315907',
        team: {
          localizedGameMode: '2v2',
          members: [
            {
              favoriteRace: 'zerg',
              name: 'DeacsOut',
              playerId: '12526931',
              region: 1,
            },
            {
              favoriteRace: 'terran',
              name: 'Sam',
              playerId: '12534932',
              region: 1,
            },
          ],
        },
        leagueName: 'PLATINUM',
        localizedDivisionName: 'Leviathan Indigo ',
        rank: 10,
        wins: 24,
        losses: 18,
      },
    ],
    allLadderMemberships: [
      {
        ladderId: '315225',
        localizedGameMode: '1v1 Silver',
        rank: 27,
      },
      {
        ladderId: '315297',
        localizedGameMode: '1v1 Gold',
        rank: 45,
      },
      {
        ladderId: '315907',
        localizedGameMode: '2v2 Platinum',
        rank: 10,
      },
    ],
  },
};
