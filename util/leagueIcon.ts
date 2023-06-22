import { ImageSourcePropType } from 'react-native/types'
import { league, leagueImage } from '../types'

export const leagueIcon:{[key in league]: ImageSourcePropType} = {
  'BRONZE' : require('../images/bronze.png'),
  'DIAMOND' : require('../images/diamond.png'),
  'GOLD': require('../images/gold.png'),
  'GRANDMASTER' : require('../images/grandmaster.png'),
  'MASTER' : require('../images/master.png'),
  'PLATINUM':require('../images/platinum.png'),
  'SILVER' : require('../images/silver.png'),
  'null': require('../images/null.png')
}