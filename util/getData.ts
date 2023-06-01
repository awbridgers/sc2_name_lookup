import {auth} from '../config';
import {Alert} from 'react-native';
import {Data, FetchError} from '../types';
export const getReplayStatsData = async (name: string): Promise<number> => {
  try {
    const data = await fetch(`https://api.sc2replaystats.com/player/search`, {
      method: 'post',
      headers: {
        Authorization: auth,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: `${encodeURIComponent('players_name')}=${encodeURIComponent(
        name
      )}&${encodeURIComponent('server')}=${encodeURIComponent('us')}`,
    }).catch((e) => {
      throw e;
    });
    const {items} = await data.json().catch((e) => {
      throw e;
    });

    if (items.length > 1) {
      throw new FetchError(
        'Too Many Results',
        'The name you entered has too many results to select from. Try entering the Battle.net ID if you know it.'
      );
    } else if (items.length < 1) {
      throw new FetchError(
        'Name not found',
        'There is no SC2 Replay Stats account associated with the name you entered. Try entering the Battle.net ID instead.'
      );
    }
    return items[0].character_link_id;
  } catch (e) {
    if (e instanceof FetchError) {
      throw e;
    }
    throw new FetchError(
      'There was an error fetching user.',
      'Please try again.'
    );
  }
};

export const getBattleNetStats = async (
  id: number,
  token: string
): Promise<Data> => {
  try {
    const profileData = await fetch(
      `https://us.api.blizzard.com/sc2/profile/1/1/${id}`,
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const profile = await profileData.json();
    const ladderData = await fetch(
      `https://us.api.blizzard.com/sc2/profile/1/1/${id}/ladder/summary`,
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const ladder = await ladderData.json();
    return {
      summary: profile.summary,
      snapshot: profile.snapshot,
      career: profile.career,
      ladder: {
        showCaseEntries: ladder.showCaseEntries,
        allLadderMemberships: ladder.allLadderMemberships,
      },
    };
  } catch (e) {
    throw new FetchError('BattleNet ID not found', 'Please try again.');
  }
};
