import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import Results from '../Results';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamsList} from '../../types';
import {render, screen, within} from '@testing-library/react-native';
import {sampleData} from '../../sampleData';
import '@testing-library/jest-native/extend-expect';

//!mocking these images out to random numbers since
//!jest throws an error if the source is a not of type number
jest.mock('../../images/silver.png', () => 69);
jest.mock('../../images/gold.png', () => 420);

const mockNav = jest.fn();
const data = {
  ...sampleData,
};
const navigation = {
  navigate: mockNav,
} as any as NativeStackNavigationProp<
  RootStackParamsList,
  'Results',
  undefined
>;
const props: NativeStackScreenProps<RootStackParamsList, 'Results'> = {
  navigation: navigation,
  route: {params: {data: data}} as RouteProp<RootStackParamsList, 'Results'>,
};

describe('Results Page', () => {
  describe('basic rendering', () => {
    it('should render the results', () => {
      render(<Results {...props} />);
      expect(screen.getByText('DeacsOut')).toBeTruthy();
    });
    it('should show the right image for league', () => {
      render(<Results {...props} />);
      const terran = screen.getByTestId('terran');
      const image = within(terran).getByLabelText('leagueImage');
      expect(image).toHaveProp('source', 69);
      const zerg = screen.getByTestId('zerg');
      const image2 = within(zerg).getByLabelText('leagueImage');
      expect(image2).toHaveProp('source', 420);
    });
    it('should have no image if no league', () => {
      render(<Results {...props} />);
      const protoss = screen.getByTestId('protoss');
      expect(within(protoss).getByText('N/A')).toBeTruthy();
    });
  });
  describe('functions', () => {
    it('should calculate the total record', () => {
      render(<Results {...props} />);
      expect(screen.getByText('Season Record: 27-15 (64%)')).toBeTruthy();
    });
    it('should calculate race record', () => {
      render(<Results {...props} />);
      const terran = screen.getByTestId('terran');
      const record = within(terran).getByText('20-7');
      expect(record).toBeTruthy();
    });
    it('should show 0-0 if no games played', () => {
      render(<Results {...props} />);
      const protoss = screen.getByTestId('protoss');
      expect(within(protoss).getByText('0-0')).toBeTruthy();
    });
    it('should calculate win percentage', () => { 
      render(<Results {...props} />);
      const terran = screen.getByTestId('terran');
      expect(within(terran).getByText('74%')).toBeTruthy();
     })
     it('should show 0% if no games played', () => { 
      render(<Results {...props} />);
      const protoss = screen.getByTestId('protoss');
      expect(within(protoss).getByText('0%')).toBeTruthy();
      })
  });
});
