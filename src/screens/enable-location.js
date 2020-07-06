import Geolocation from '@react-native-community/geolocation';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {ThemedView, Text, Button} from 'src/components';
import ModalSearchLocation from 'src/components/modalLocation';
import {
  getAddressFromCurrentLocation,
  LOCATION_DEFAULT,
} from 'src/config/constant';
import {updateLocation} from 'src/modules/auth/actions';
import {closeGettingStarted} from 'src/modules/common/actions';
import {routerMainSelector} from 'src/modules/common/selectors';
import {padding, margin} from 'src/components/config/spacing';

const {width, height} = Dimensions.get('window');

const SIZE_IMAGE = (width * 3) / 5;

class EnableLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModal: false,
      loading: false,
    };
  }

  handleGettingStarted = () => {
    const {dispatch} = this.props;
    dispatch(closeGettingStarted());
  };

  openOrCloseModal(status) {
    this.setState({
      visibleModal: status,
    });
  }

  getLocation() {
    this.setState({loading: true});
    Geolocation.getCurrentPosition(
      async position => {
        console.log(position);
        if (position.coords?.latitude) {
          this.getAddress(
            position?.coords?.latitude,
            position?.coords?.longitude,
          );
        } else {
          this.getAddress(
            LOCATION_DEFAULT.latitude,
            LOCATION_DEFAULT.longitude,
          );
        }
      },
      error => {
        console.log(error);
        this.getAddress(LOCATION_DEFAULT.latitude, LOCATION_DEFAULT.longitude);
      },
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 5000,
        distanceFilter: 0,
      },
    );
  }

  async getAddress(latitude, longitude) {
    const result = await getAddressFromCurrentLocation(latitude, longitude);
    this.props.dispatch(updateLocation(result));
    this.setState({loading: false});
    this.handleGettingStarted();
  }

  async userSelectLocation(value) {
    this.openOrCloseModal(false);
    this.handleGettingStarted();
  }

  render() {
    const {t} = this.props;
    return (
      <ThemedView isFullView style={styles.container}>
        <View style={styles.imageWrapper}>
          <Image
            style={styles.imgMap}
            source={require('src/assets/images/location.png')}
            resizeMode="stretch"
          />
        </View>
        <View style={styles.contentWrapper}>
          <Text h2 style={styles.txtTitle}>
            {t('common:text_find_location')}
          </Text>
          <Text h5 colorSecondary style={styles.textDescription}>
            {t('common:text_find_location_description')}
          </Text>
          <View style={styles.buttonsWrapper}>
            <Button
              title={t('common:text_button_enable_location')}
              onPress={() => this.getLocation()}
              loading={this.state.loading}
              containerStyle={[styles.button]}
              buttonStyle={[styles.locationBtn, styles.buttonStyles]}
              titleStyle={styles.btnText}
            />
            <Button
              secondary
              title={t('common:text_button_add_new_address')}
              onPress={() => this.openOrCloseModal(true)}
              containerStyle={styles.button}
              buttonStyle={styles.buttonStyles}
              titleProps={styles.btnText}
            />
          </View>
          <Text onPress={this.handleGettingStarted} style={styles.textSkip}>
            {t('common:text_skip')}
          </Text>
        </View>
        <ModalSearchLocation
          find={true}
          closeModal={() => this.openOrCloseModal(false)}
          onSelectLocation={detail => {
            this.userSelectLocation(detail);
          }}
          visibleModal={this.state.visibleModal}
        />
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#66D7CD',
    justifyContent: 'center',
  },
  imageWrapper: {
    flex: 1,
    marginTop: height * 0.1,
  },
  imgMap: {
    width: SIZE_IMAGE,
    height: SIZE_IMAGE,
  },
  contentWrapper: {
    position: 'absolute',
    backgroundColor: '#fff',
    bottom: 0,
    flex: 1,
    width: '100%',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  txtTitle: {
    marginTop: margin.big - 1,
    fontSize: 22,
    fontFamily: 'VarelaRound-Regular',
  },
  textDescription: {
    textAlign: 'center',
    width: '85%',
    marginTop: margin.small + 1,
    fontFamily: 'VarelaRound-Regular',
  },
  buttonStyles: {
    borderRadius: 30,
  },
  btnText: {
    fontFamily: 'VarelaRound-Regular',
  },
  button: {
    flex: 1,
    marginHorizontal: 7,
  },
  locationBtn: {
    backgroundColor: '#FF7A53',
    shadowColor: '#FF7A53',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    borderWidth: 0,
  },
  textSkip: {
    padding: padding.small + 1,
    marginVertical: margin.small + 1,
    textDecorationLine: 'underline',
    color: '#FF7A53',
    fontWeight: 'bold',
    fontFamily: 'VarelaRound-Regular',
  },
  buttonsWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '90%',
    marginTop: margin.big + margin.small,
    marginBottom: margin.small / 5,
  },
});

const mapStateToProps = state => {
  return {
    router: routerMainSelector(state),
  };
};
const EnableLocationComponent = connect(mapStateToProps, null)(EnableLocation);
export default function(props) {
  const {t} = useTranslation();
  return <EnableLocationComponent t={t} {...props} />;
}
