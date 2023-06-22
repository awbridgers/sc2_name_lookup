import {View, StyleSheet, Text, Image} from 'react-native';
import {Data, RootStackParamsList, raceData} from '../types';
import {leagueIcon} from '../util/leagueIcon';
import {useEffect, useMemo} from 'react';
import {raceIcon} from '../util/raceIcon';
import {fixString} from '../util/fixString';
import { fixNumber } from '../util/fixNumber';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamsList, 'Results'>

const Results = ({navigation, route}: Props) => {
  const data = route.params.data
  //console.log(data)
  const record = useMemo(() => {
    const wins = data.snapshot.seasonSnapshot['1v1'].totalWins;
    const games = data.snapshot.seasonSnapshot['1v1'].totalGames;
    return {wins, games};
  }, [data]);
  const raceData = useMemo<raceData>(() => {
    const races: raceData = {
      terran: null,
      zerg: null,
      protoss: null,
      random: null,
    };
    const ladder = data.ladder.showCaseEntries.filter(
      (x) => x.team.localizedGameMode === '1v1'
    );
    for (const league of ladder) {
      races[league.team.members[0].favoriteRace] = {
        leagueName: league.leagueName,
        wins: league.wins,
        losses: league.losses,
      };
    }
    return races;
  }, [data]);
  return (
    <View style={styles.container}>
      <View style={styles.nameView}>
        <Text style={styles.name}>{data.summary.displayName}</Text>
        <Text style={styles.subTitle}>
          Season Record: {record.wins}-{record.games - record.wins} (
          {Math.round((record.wins * 100) / record.games)}%)
        </Text>
      </View>
      <View style={styles.leagueHigh}>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.subTitle}>Current League</Text>
          <Image
            style={styles.leagueImage}
            source={leagueIcon[data.career.current1v1LeagueName]}
          />
          <Text style={styles.text}>{fixString(data.career.current1v1LeagueName)}</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.subTitle}>Career High</Text>
          <Image
            style={styles.leagueImage}
            source={leagueIcon[data.career.best1v1Finish.leagueName]}
          />
          <Text style={styles.text}>
            {fixString(data.career.best1v1Finish.leagueName)}
          </Text>
        </View>
      </View>
      <View style={styles.stats}>
        <View style={styles.header}>
          <View style={styles.race}>
            <Text style={styles.subTitle}>Race</Text>
          </View>
          <View style={styles.raceDivision}>
            <Text style={styles.subTitle}>League</Text>
          </View>
          <View style={styles.raceRecord}>
            <Text style={styles.subTitle}>W-L</Text>
          </View>
        </View>
        {(Object.keys(raceData) as Array<keyof raceData>).map((key,i) => {
          return (
            <View key={key} style={styles.row} testID = {`${key}`}>
              <View style={styles.race}>
                <Image style={styles.raceImage} source={raceIcon[key]} />
                <Text style={styles.text}>{fixString(key)}</Text>
              </View>
              <View style={styles.raceDivision}>
                {raceData[key] !== null ? (
                  <>
                    <Image
                      accessibilityLabel = 'leagueImage'
                      style={styles.leagueImage}
                      source={leagueIcon[raceData[key]!.leagueName]}
                    />
                    <Text style={styles.subTitle}>
                      {fixString(raceData[key]!.leagueName)}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.subTitle}>N/A</Text>
                  </>
                )}
              </View>
              <View style={styles.raceRecord}>
                <Text style={styles.subTitle}>
                  {raceData[key] !== null
                    ? `${fixNumber(raceData[key]!.wins)}-${fixNumber(raceData[key]!.losses)}`
                    : '0-0'}
                </Text>
                <Text style={styles.subTitle}>
                  {raceData[key] !== null
                    ? `${Math.round(
                        (raceData[key]!.wins * 100) /
                          (raceData[key]!.wins + raceData[key]!.losses)
                      )}%`
                    : '0%'}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    flex: 1,
  },
  name: {
    color: 'white',
    fontSize: 25,
    alignSelf: 'center',
  },
  nameView:{
    alignItems: 'center',
    backgroundColor: '#001F42',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'white'

  },
  text: {
    color: 'white',
    fontSize: 18,
  },
  subTitle: {
    fontSize: 20,
    color: 'white',
  },
  leagueHigh: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom:15,
    backgroundColor: '#001F42',

  },
  leagueImage: {
    marginTop: 5,
    marginBottom: 5,
  },
  stats: {
    flex: 1,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    borderWidth: 1,
    //alignItems: 'center',
    justifyContent: 'space-around',
    borderColor: 'white',
    backgroundColor: '#001F42',
    borderTopWidth: 0,
  },
  header: {
    flexDirection: 'row',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#001F42',
    borderColor: 'white',
  },
  raceImage: {
    height: 60,
    width: 60,
    resizeMode: 'contain',
  },
  race: {
    width: 100,
    alignItems: 'center',
    flex:1,
    justifyContent: 'center',
  },
  raceDivision: {
    width: 75,
    alignItems: 'center',
    flex:1,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderLeftWidth : 1,
    borderColor: 'white'
  },
  raceRecord: {
    width: 75,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    flex:1,
  },

});

export default Results;
