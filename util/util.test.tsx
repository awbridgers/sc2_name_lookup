import {FetchError, league, race} from '../types';
import {fixName} from './fixName';
import {fixNumber} from './fixNumber';
import {fixString} from './fixString';
import {leagueIcon} from './leagueIcon';
import {render, screen} from '@testing-library/react-native';
import {Image} from 'react-native';
import {raceIcon} from './raceIcon';
import {getBattleNetStats, getReplayStatsData} from './getData';
import {sampleData} from '../sampleData';

jest.mock('./leagueIcon');
jest.mock('./raceIcon');
describe('util functions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should extract the username from a line of text', () => {
    expect(fixName(['testName', 'test2', 'test3'])).toEqual('testName');
    expect(fixName(['testName\nanotherTest'])).toEqual('testName');
    expect(fixName(['clanTag testName'])).toEqual('testName');
    expect(fixName([' '])).toEqual('');
    expect(fixName([])).toEqual('');
    expect(fixName([' \nrandomTest'])).toEqual('');
  });
  it('should format numbers to shorter display', () => {
    expect(fixNumber(10)).toEqual('10');
    expect(fixNumber(1000)).toEqual('1.0K');
    expect(fixNumber(1234567)).toEqual('1.2M');
  });
  it('should fix the name of leauges', () => {
    expect(fixString(null)).toEqual('N/A');
    expect(fixString('GOLD')).toEqual('Gold');
  });
  it('should select the correct league image', () => {
    for (const key in leagueIcon) {
      const league = key as league;
      expect(leagueIcon[league]).toEqual(
        `../images/${league.toLowerCase()}.png`
      );
    }
  });
  it('should show the correct race Icon', () => {
    for (const key in raceIcon) {
      const raceName = key as race;
      expect(raceIcon[raceName]).toEqual(
        `../images/${raceName.toLowerCase()}.png`
      );
    }
  });
  describe('getData function', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    describe('successful fetch', () => {
      it('should fetch the data if 1 item', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
          json: () =>
            Promise.resolve({
              items: [{character_link_id: 12345}],
            }),
        } as unknown as Response);
        const data = await getReplayStatsData('testName');
        expect(data).toEqual(12345);
      });
      it('should throw if more than 1 item', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
          json: () =>
            Promise.resolve({
              items: [{character_link_id: 12345}, 'random test'],
            }),
        } as unknown as Response);
        expect.assertions(1);
        try {
          await getReplayStatsData('testName');
        } catch (e) {
          expect(e).toMatchObject({message: 'Too Many Results'});
        }
      });
      it('should throw if no items', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
          json: () =>
            Promise.resolve({
              items: [],
            }),
        } as unknown as Response);
        expect.assertions(1);
        try {
          await getReplayStatsData('testName');
        } catch (e) {
          expect(e).toMatchObject({message: 'Name not found'});
        }
      });
    });
    describe('unsuccessful fetch', () => {
      it('should throw an error on fetch fail', async () => {
        jest.spyOn(global, 'fetch').mockRejectedValue({});
        expect.assertions(1);
        try {
          await getReplayStatsData('testName');
        } catch (e) {
          expect(e).toMatchObject({
            message: 'There was an error fetching user.',
          });
        }
      });
      it('should throw an error on json fail', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
          json: () => Promise.reject({}),
        } as unknown as Response);
        expect.assertions(1);
        try {
          await getReplayStatsData('testName');
        } catch (e) {
          expect(e).toMatchObject({
            message: 'There was an error fetching user.',
          });
        }
      });
    });
  });
  describe('getBattleNet Function', () => {
    describe('successfull fetch', () => {
      it('should return the data', async () => {
        jest
          .spyOn(global, 'fetch')
          .mockResolvedValueOnce({
            json: () =>
              Promise.resolve({
                summary: sampleData.summary,
                snapshot: sampleData.snapshot,
                career: sampleData.career,
              }),
          } as unknown as Response)
          .mockResolvedValueOnce({
            json: () =>
              Promise.resolve({
                showCaseEntries: sampleData.ladder.showCaseEntries,
                allLadderMemberships: sampleData.ladder.allLadderMemberships,
              }),
          } as unknown as Response);
          expect.assertions(1)
        expect(await getBattleNetStats(1, 'test')).toMatchObject(sampleData);
      });
    });
    describe('failed fetch', () => {
      it('should throw error on profile fetch', async () => {
        jest.spyOn(global, 'fetch').mockRejectedValue({});
        expect.assertions(1)
        try {
          const test = await getBattleNetStats(1, 'test');
        } catch (e) {
          expect(e).toMatchObject({message: 'BattleNet ID not found'});
        }
      });
      it('should throw error on ladder fetch', async() => {
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              summary: sampleData.summary,
              snapshot: sampleData.snapshot,
              career: sampleData.career,
            }),
        } as unknown as Response).mockRejectedValue({});
        expect.assertions(1)
        try{
          await getBattleNetStats(1, 'test');
        }catch(e){
          expect(e).toMatchObject({message: 'BattleNet ID not found'})
        }
      });
      it('should throw on json profile fail', async () => { 
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          json: () => Promise.reject({})
        }as unknown as Response)
       expect.assertions(1)
       try{
        await getBattleNetStats(1, 'test');
       }
       catch(e){
        expect(e).toMatchObject({message:'BattleNet ID not found'})
       }
      })
      it('should throw on josn ladder fail', async () => { 
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              summary: sampleData.summary,
              snapshot: sampleData.snapshot,
              career: sampleData.career,
            }),
        } as unknown as Response).mockResolvedValueOnce({
          json:()=>Promise.reject({})
        } as unknown as Response);
        expect.assertions(1);
        try{
          await getBattleNetStats(1, 'test');
        }
        catch(e){
          expect(e).toMatchObject({message: 'BattleNet ID not found'})
        }
       })
    });
  });
});
