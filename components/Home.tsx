import {StatusBar} from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Camera, CameraCapturedPicture, CameraType} from 'expo-camera';
import {useCallback, useEffect, useRef, useState} from 'react';
import MlkitOcr from 'react-native-mlkit-ocr';
import {StarCraft2API} from 'starcraft2-api';
import base64 from 'react-native-base64';
import {auth, clientID, secret} from '../config';
import Results from './Results';
import {sampleData} from '../sampleData';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Data, FetchError, RootStackParamsList} from '../types';
import {getBattleNetStats, getReplayStatsData} from '../util/getData';
import { fixName } from '../util/fixName';

type Props = NativeStackScreenProps<RootStackParamsList, 'Home'>;

export default function Home({navigation}: Props) {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const [data, setData] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const cameraRef = useRef<Camera>(null);
  const prevData = useRef<Data | null>(null);

  const takePic = async () => {
    if (permission && permission.granted) {
      if (token) {
        if (ready && cameraRef.current) {
          const pic = await cameraRef.current.takePictureAsync({
            skipProcessing: true,
          });
          setLoading(true);
          setShowModal(false);
          const resultFromUri = await MlkitOcr.detectFromUri(pic.uri);
          //put all the text into 1 array
          const textArray = resultFromUri.map((x) => {
            return x.text;
          });
          const userName = fixName(textArray);
          console.log(userName)
          if (userName) {
            try {
              const id = await getReplayStatsData(userName);
              const stats = await getBattleNetStats(id, token);
              setLoading(false)
              navigation.navigate('Results', {data: stats})
            } catch (e) {
              setLoading(false);
              if (e instanceof FetchError) {
                Alert.alert(e.message, e.subMessage);
              } else {
                Alert.alert(
                  'There was an error fetching the data.',
                  'Please try again.'
                );
              }
            }
          }
        } else {
          Alert.alert(
            'Permission needed.',
            'You have not given this app access to your camera.'
          );
        }
      }
    }
  };
  const getData = async (name: string) => {
    setLoading(true);
    if (name.length > 0) {
      if (token) {
        try {
          const id = /[\d]+/.test(name)
            ? +name
            : await getReplayStatsData(name);
          const stats = await getBattleNetStats(id, token);
          prevData.current = stats;
          setLoading(false)
          navigation.push('Results', {data: stats});
        } catch (e) {
          setLoading(false);
          if (e instanceof FetchError) {
            Alert.alert(e.message, e.subMessage);
          } else {
            Alert.alert(
              'There was an error fetching the data.',
              'Please try again.'
            );
          }
        }
      } else {
        Alert.alert('Token error');
        setLoading(false);
      }
    } else {
      Alert.alert('Please Enter a Name or BattleNet ID Number.');
      setLoading(false);
    }
  };

  //get camera permission
  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, [permission]);
  useEffect(()=>{
    setLoading(false)
  },[])

  //get the token for the API
  useEffect(() => {
    if (!token) {
      const getToken = async () => {
        try {
          const data = await fetch('https://oauth.battle.net/token', {
            method: 'post',
            body: `${encodeURIComponent('grant_type')}=${encodeURIComponent(
              'client_credentials'
            )}`,
            headers: {
              Authorization: `Basic ${base64.encode(`${clientID}:${secret}`)}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
          const res = await data.json();
          setToken(res.access_token);
        } catch (e) {
          console.log(e);
        }
      };
      getToken();
    }
  }, [token]);

  return (
    <View style={styles.container}>
      <Modal visible={loading} animationType="fade" transparent={true}>
        <View style={styles.loading}>
          <ActivityIndicator size={Platform.OS === 'android' ? 150 : 'large'} />
        </View>
      </Modal>
      <Modal
        visible={showModal}
        animationType="slide"
        style={styles.modal}
        transparent={false}
      >
        <Camera
          type={CameraType.back}
          ref={cameraRef}
          onCameraReady={() => setReady(true)}
          style={styles.camera}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => takePic()}>
            <Text>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowModal(false)}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.toggleCamera}>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => setShowModal(!showModal)}
        >
          <Text style={{fontSize: 20}}>Toggle Camera</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.spacer}>
        <Text style={styles.name}>-OR-</Text>
      </View>
      <View style={styles.search}>
        <Text style={styles.name}>Enter a name or BattleNet ID</Text>
        <TextInput
          onChangeText={setName}
          style={styles.searchBar}
          value={name}
        />
        <TouchableOpacity
          onPress={() => getData(name)}
          style={styles.cameraButton}
        >
          <Text style={{fontSize: 20}}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001F42',
    justifyContent: 'center',
    //paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  loading: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  modal: {
    height: '50%',
    width: '50%',
    backgroundColor: 'blue',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  toggleCamera: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: 50,
    justifyContent: 'center',
    backgroundColor: 'grey',
    alignItems: 'center',
    flex: 1,
    margin: 5,
    borderRadius: 8,
  },
  cameraButton: {
    height: 50,
    width: 100,
    margin: 5,
    borderRadius: 8,
    backgroundColor: '#00B4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    aspectRatio: 16 / 9,
    flex: 1,
  },
  name: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  searchBar: {
    width: 275,
    padding: 10,
    backgroundColor: 'white',
    margin: 10,
    fontSize: 25,
  },
  search: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  spacer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 25,
  },
});
