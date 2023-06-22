import { ImageSourcePropType } from 'react-native/types'
import { league } from '../../types'
export const leagueIcon:{[key in league]: ImageSourcePropType} = {
  'BRONZE' : '../images/bronze.png' as ImageSourcePropType,
  'DIAMOND' : '../images/diamond.png'as ImageSourcePropType,
  'GOLD': '../images/gold.png'as ImageSourcePropType,
  'GRANDMASTER' : '../images/grandmaster.png'as ImageSourcePropType,
  'MASTER' : '../images/master.png'as ImageSourcePropType,
  'PLATINUM':'../images/platinum.png'as ImageSourcePropType,
  'SILVER' : '../images/silver.png'as ImageSourcePropType,
  'null': '../images/null.png' as ImageSourcePropType
}