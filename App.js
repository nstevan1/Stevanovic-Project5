import * as Location from 'expo-location';
import { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Marker } from 'react-native-maps';
import MapView from 'react-native-maps';
import Notification from './Notifications';

export default class App extends Component {
  state = {
    currentLocation: null,
    location: null,
    message: '',
    notify: false,
    poi1: {
      coords: {
        latitude: 33.307146,
        longitude: -111.681177,
      },
    },
    poi2: {
      coords: {
        latitude: 33.423204,
        longitude: -111.939612,
      },
    },
  };

  async componentDidMount() {
    const permission = await Location.requestForegroundPermissionsAsync();
    if(permission.granted) { this.getLocation(); }
  }

  async getLocation() {
    let loc = await Location.getCurrentPositionAsync();
    this.setState({ currentLocation: loc, location: loc });
  }

  onTap(button) {
    if(button === 'POI 1') { this.setState({ currentLocation: this.state.poi1 }); }
    else if(button === 'POI 2') { this.setState({ currentLocation: this.state.poi2 }); }
    else { this.setState({ currentLocation: this.state.location }); }
    this.setState({ message: `Changed to ${button}` });
    this.toggleNotification();
  }

  render() {
    const notify = this.state.notify
      ? <Notification
          autoHide
          message={this.state.message}
          onClose={this.toggleNotification}
        />
      : null;
    return this.state.location ? (
      <SafeAreaView style={styles.container}>
        <MapView
          style={styles.map}
          region={{
            latitude: this.state.currentLocation.coords.latitude,
            latitudeDelta: 0.09,
            longitude: this.state.currentLocation.coords.longitude,
            longitudeDelta: 0.04,
          }}
        >
          <Marker
            coordinate={this.state.currentLocation.coords}
            image={require('./assets/you-are-here.png')}
          />
          {notify}
        </MapView>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            onPress={() => this.onTap('You')}
            style={styles.button}
          >
            <Text>You</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.onTap('POI 1')}
            style={styles.button}
          >
            <Text>POI 1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.onTap('POI 2')}
            style={styles.button}
          >
            <Text>POI 2</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    ) : null;
  }

  toggleNotification = () => { this.setState({ notify: !this.state.notify }); }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: '#3066be',
    borderRadius: '25%',
    justifyContent: 'center',
    margin: 10,
  },
  container: {
    flex: 1,
  },
  map: {
    flex: 7,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});