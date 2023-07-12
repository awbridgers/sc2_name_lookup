import React from 'react';
import '@testing-library/jest-native/extend-expect';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react-native';
import Home from '../Home';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {Data, FetchError, RootStackParamsList} from '../../types';
import {RouteProp} from '@react-navigation/native';
import {Camera, PermissionResponse, PermissionStatus} from 'expo-camera';
import * as util from '../../util/getData';
import {Platform} from 'react-native';
jest.mock('expo-camera');

const mockPermission: PermissionResponse = {
  canAskAgain: false,
  granted: true,
  expires: 'never',
  status: PermissionStatus.GRANTED,
};
import * as useToken from '../../hooks/useToken';
import {sampleData} from '../../sampleData';
import {Alert} from 'react-native';
const mockPermissionReq = jest.fn();
const mockNav = jest.fn();
const navigation = {
  navigate: mockNav,
} as any as NativeStackNavigationProp<RootStackParamsList, 'Home', undefined>;
const props: NativeStackScreenProps<RootStackParamsList, 'Home'> = {
  navigation: navigation,
  route: {} as RouteProp<RootStackParamsList, 'Home'>,
};

describe('Home Component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest
      .spyOn(Camera, 'useCameraPermissions')
      .mockReturnValue([
        mockPermission,
        () => Promise.resolve(mockPermission),
        () => Promise.resolve(mockPermission),
      ]);
    jest.spyOn(useToken, 'useToken').mockImplementation(() => 'test');
  });
  describe('basic rendering', () => {
    it('should render the homepage', async () => {
      render(<Home {...props} />);
      expect(screen.getByText('SC2 Stats')).toBeTruthy();
    });
  });
  describe('Camera Button/Modal', () => {
    //! Not really sure how to go about testing the expo-camera
    //! portion of the camera search
    it('should bring up the camera modal', async () => {
      render(<Home {...props} />);
      const button = screen.getByText('Toggle Camera');
      fireEvent.press(button);
      expect(screen.getByText('Take Photo')).toBeTruthy();
    });
  });
  describe('text search', () => {
    beforeEach(() => {
      jest.spyOn(util, 'getReplayStatsData').mockResolvedValue(12334);
      jest
        .spyOn(util, 'getBattleNetStats')
        .mockResolvedValue({snapshot: sampleData.snapshot} as Data);
    });
    it('should search the name', async () => {
      render(<Home {...props} />);
      fireEvent.changeText(
        screen.getByPlaceholderText('Enter name here'),
        'Deacsout'
      );
      fireEvent.press(screen.getByText('Search'));
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveProp('visible', true);
      });
      await waitFor(() => {
        expect(util.getReplayStatsData).toBeCalledWith('Deacsout');
        expect(util.getBattleNetStats).toBeCalled();
      });
    });
    it('should throw error on replaystats', async () => {
      jest.spyOn(util, 'getReplayStatsData').mockRejectedValue({});
      const alert = jest.spyOn(Alert, 'alert');
      render(<Home {...props} />);
      fireEvent.changeText(
        screen.getByPlaceholderText('Enter name here'),
        'Deacsout'
      );
      fireEvent.press(screen.getByText('Search'));
      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith(
          'There was an error fetching the data.',
          'Please try again.'
        );
      });
    });
    it('should throw fetcherror on replaystats', async () => {
      jest
        .spyOn(util, 'getReplayStatsData')
        .mockRejectedValue(new FetchError('message', 'submessage'));
      const alert = jest.spyOn(Alert, 'alert');
      render(<Home {...props} />);
      fireEvent.changeText(
        screen.getByPlaceholderText('Enter name here'),
        'Deacsout'
      );
      fireEvent.press(screen.getByText('Search'));
      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith('message', 'submessage');
      });
    });
    it('should throw fetcherror on battlenet', async () => {
      jest
        .spyOn(util, 'getBattleNetStats')
        .mockRejectedValue(new FetchError('message', 'submessage'));
      const alert = jest.spyOn(Alert, 'alert');
      render(<Home {...props} />);
      fireEvent.changeText(
        screen.getByPlaceholderText('Enter name here'),
        'Deacsout'
      );
      fireEvent.press(screen.getByText('Search'));
      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith('message', 'submessage');
      });
    });
    it('should throw error on battlenet', async () => {
      jest.spyOn(util, 'getBattleNetStats').mockRejectedValue({});
      const alert = jest.spyOn(Alert, 'alert');
      render(<Home {...props} />);
      fireEvent.changeText(
        screen.getByPlaceholderText('Enter name here'),
        'Deacsout'
      );
      fireEvent.press(screen.getByText('Search'));
      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith(
          'There was an error fetching the data.',
          'Please try again.'
        );
      });
    });
    it('should not search if no named entered', () => {
      render(<Home {...props} />);
      const alert = jest.spyOn(Alert, 'alert');
      fireEvent.press(screen.getByText('Search'));
      expect(alert).toHaveBeenCalledWith(
        'Please Enter a Name or BattleNet ID Number.'
      );
    });
    it('should not search if no token', () => {
      jest.spyOn(useToken, 'useToken').mockImplementation(() => '');
      const alert = jest.spyOn(Alert, 'alert');
      render(<Home {...props} />);
      fireEvent.changeText(
        screen.getByPlaceholderText('Enter name here'),
        'DeacsOut'
      );
      fireEvent.press(screen.getByText('Search'));
      expect(alert).toHaveBeenCalledWith('Token error');
    });
    it('should skip sc2rs search if search is a number', async () => {
      render(<Home {...props} />);
      fireEvent.changeText(
        screen.getByPlaceholderText('Enter name here'),
        '123456'
      );
      fireEvent.press(screen.getByText('Search'));
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toBeTruthy();
        expect(util.getReplayStatsData).not.toBeCalled();
        expect(util.getBattleNetStats).toBeCalled();
      });
    });
  });
  describe('permissions', () => {
    it('should ask for camera permission', async () => {
      const mockreq = jest.fn();
      jest.spyOn(Camera, 'useCameraPermissions').mockReturnValue([
        {
          ...mockPermission,
          granted: false,
        },
        mockreq,
        jest.fn(),
      ]);
      render(<Home {...props} />);
      await waitFor(() => {
        expect(mockreq).toBeCalled();
      });
    });
    it('should ask for camera permission if permission doesnt exist', async () => {
      const mockreq = jest.fn();
      jest
        .spyOn(Camera, 'useCameraPermissions')
        .mockReturnValue([null, mockreq, jest.fn()]);
      render(<Home {...props} />);
      await waitFor(() => {
        expect(mockreq).toBeCalled();
      });
    });
  });
  describe('platform', () => {
    beforeEach(() => {
      jest.spyOn(util, 'getReplayStatsData').mockResolvedValue(1);
      jest.spyOn(util, 'getBattleNetStats').mockResolvedValue({} as Data);
    });
    it('should have the right size loading for Android', async () => {
      jest.spyOn(util, 'getBattleNetStats').mockRejectedValue({});
      const alert = jest.spyOn(Alert, 'alert');
      const os = Platform.OS
      Platform.OS = 'android';
      render(<Home {...props} />);
      fireEvent.changeText(
        screen.getByPlaceholderText('Enter name here'),
        'deacsout'
      );
      fireEvent.press(screen.getByText('Search'));
      await waitFor(() => {
        expect(screen.getByTestId('spinner')).toHaveProp('size', 150);
      });
      Platform.OS = os;
    });
    it('should have the right size loading for Apple', async () => {
      jest.spyOn(util, 'getBattleNetStats').mockRejectedValue({});
      const os = Platform.OS
      Platform.OS = 'ios'
      const alert = jest.spyOn(Alert, 'alert');
      const save = Platform;
      Platform.OS = 'android';
      render(<Home {...props} />);
      fireEvent.changeText(
        screen.getByPlaceholderText('Enter name here'),
        'deacsout'
      );
      fireEvent.press(screen.getByText('Search'));
      await waitFor(() => {
        expect(screen.getByTestId('spinner')).toHaveProp('size', 150);
      });
      Platform.OS = os;
    });
  });
});
