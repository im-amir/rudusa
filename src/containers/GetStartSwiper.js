import React from 'react';
import {withTranslation} from 'react-i18next';
import {StyleSheet, View, Dimensions} from 'react-native';
import {Text, Image, ThemeConsumer} from 'src/components';
import AppIntroSlider from 'react-native-app-intro-slider';
import Ion from 'react-native-vector-icons/Ionicons';
import {margin} from 'src/components/config/spacing';

const {width, height} = Dimensions.get('window');
const WIDTH_IMAGE = width * 0.6;
const HEIGHT_IMAGE = (WIDTH_IMAGE * 390) / 375;

class GetStartSwiper extends React.Component {
  _renderItem = ({item}) => {
    return (
      <View style={styles.viewItem}>
        <Text style={styles.title}>{item.title}</Text>
        <Image
          resizeMode={'contain'}
          style={styles.image}
          source={item.image}
        />
        <Text style={styles.text}>{item.subtitle}</Text>
      </View>
    );
  };
  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ion
          name="md-arrow-round-forward"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };
  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ion name="md-checkmark" color="rgba(255, 255, 255, .9)" size={24} />
      </View>
    );
  };
  _renderSkipButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Text style={{color: "#fff"}}>Skip</Text>
      </View>
    );
  };
  render() {
    const {t} = this.props;

    const data = [
      {
        image: require('src/assets/images/getting-start/get-start-1.png'),
        title: t('getting:text_title_1'),
        subtitle: t('getting:text_subtitle_1'),
      },
      {
        image: require('src/assets/images/getting-start/get-start-2.png'),
        title: t('getting:text_title_2'),
        subtitle: t('getting:text_subtitle_2'),
      },
      {
        image: require('src/assets/images/getting-start/get-start-3.png'),
        title: t('getting:text_title_3'),
        subtitle: t('getting:text_subtitle_3'),
      },
    ];
    return (
      <ThemeConsumer>
        {({theme}) => (
          <View style={styles.container}>
            <AppIntroSlider
              renderItem={this._renderItem}
              data={data}
              onDone={() => this.props.handleGettingStarted()}
              activeDotStyle={{backgroundColor: theme.colors.primary}}
              renderDoneButton={this._renderDoneButton}
              renderNextButton={this._renderNextButton}
              renderSkipButton={this._renderSkipButton}
              showSkipButton={true}
            />
          </View>
        )}
      </ThemeConsumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: WIDTH_IMAGE,
    height: HEIGHT_IMAGE,
  },
  viewInfo: {
    marginVertical: margin.big + margin.small,
  },
  text: {
    textAlign: 'center',
    width: '80%',
    marginTop: 20,
    fontFamily: 'VarelaRound-Regular',
  },
  title: {
    marginBottom: margin.small,
    fontSize: 24,
    fontFamily: 'VarelaRound-Regular',
    textAlign: 'center',
  },
  viewButton: {
    marginVertical: margin.big,
  },
  viewItem: {
    width: width,
    flex: 1,
    alignItems: 'center',
    marginTop: height * 0.2,
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: "#FF7A53",
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default withTranslation()(GetStartSwiper);
