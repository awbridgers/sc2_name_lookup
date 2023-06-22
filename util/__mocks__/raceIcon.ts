import { ImageSourcePropType } from 'react-native/types'
import { race } from '../../types'
import { raceImage } from '../../types'

export const raceIcon: raceImage = {
  'terran' : '../images/terran.png' as ImageSourcePropType,
  'zerg': '../images/zerg.png' as ImageSourcePropType,
  'protoss' : '../images/protoss.png' as ImageSourcePropType,
  'random' : '../images/random.png' as ImageSourcePropType
}