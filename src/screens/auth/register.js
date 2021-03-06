import React from 'react';

import {connect} from 'react-redux';
import firebase from '@react-native-firebase/app';
import {withTranslation} from 'react-i18next';

import {
  StyleSheet,
  ScrollView,
  View,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import {Header, Loading, Text, ThemedView, ThemeConsumer} from 'src/components';
import Container from 'src/containers/Container';
import Input from 'src/containers/input/Input';
import InputMobile from 'src/containers/input/InputMobile';
import Button from 'src/containers/Button';
import TextHtml from 'src/containers/TextHtml';
import {TextHeader, IconHeader} from 'src/containers/HeaderComponent';
import ModalVerify from './containers/ModalVerify';
import SocialMethods from './containers/SocialMethods';

import {signUpWithEmail} from 'src/modules/auth/actions';
import {authSelector} from 'src/modules/auth/selectors';
import {configsSelector, languageSelector} from 'src/modules/common/selectors';
import {checkPhoneNumber} from 'src/modules/auth/service';

import {authStack} from 'src/config/navigator';
import {margin, padding, borderRadius} from 'src/components/config/spacing';
import {lineHeights} from 'src/components/config/fonts';
import {changeColor} from 'src/utils/text-html';
import {showMessage} from 'react-native-flash-message';
import Svg, {ClipPath, Circle} from 'react-native-svg';
import {INITIAL_COUNTRY} from 'src/config/config-input-phone-number';

const {width, height} = Dimensions.get('window');

class RegisterScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: {
        first_name: '',
        last_name: '',
        name: '',
        email: '',
        password: '',
        phone_number: '',
        country_no: '',
        subscribe: false,
      },
      user: null,
      confirmResult: null,
      visibleModal: false,
      loading: false,
      error: {
        message: null,
        errors: null,
      },
    };
    this.confirmation = null;
  }

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const {data} = this.state;
        this.setState({
          user,
          data: {...data, phone_number: user.phoneNumber},
        });
      }
      if (this.state.confirmResult && Platform.OS === 'android') {
        this.register();
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  changeData = value => {
    this.setState({
      data: {
        ...this.state.data,
        ...value,
      },
    });
  };

  register = () => {
    const {enablePhoneNumber} = this.props;
    const {data} = this.state;
    let payload = data;
    if (enablePhoneNumber) {
      const user_phone_number = data.phone_number.includes(data.country_no)
        ? data.phone_number
        : data.country_no + data.phone_number;
      payload = Object.assign(data, {
        enable_phone_number: true,
        digits_phone: user_phone_number,
        digt_countrycode: data.country_no,
        digits_phone_no: data.phone_number,
      });
    }
    this.setState({loading: false});
    this.props.dispatch(signUpWithEmail(payload));
  };

  /**
   * Handle User register
   */
  handleRegister = async () => {
    this.setState({
      loading: true,
    });
    try {
      const {enablePhoneNumber} = this.props;
      const {data, user} = this.state;
      const {phone_number, country_no} = data;
      // Register with phone number
      if (enablePhoneNumber) {
        // Get user phone number
        const user_phone_number = phone_number.includes(country_no)
          ? phone_number
          : country_no + phone_number;
        await checkPhoneNumber({
          digits_phone: user_phone_number,
          type: 'register',
        });
        if (!user) {
          // Send Verify token
          const confirmResult = await firebase
            .auth()
            .signInWithPhoneNumber(user_phone_number);
          this.setState({
            confirmResult,
          });
        } else {
          this.register();
        }
      } else {
        this.register();
      }
    } catch (e) {
      showMessage({
        message: e.message,
        type: 'danger',
      });
      this.setState({
        loading: false,
      });
    }
  };

  render() {
    const {
      navigation,
      auth: {pending},
      enablePhoneNumber,
      t,
    } = this.props;
    const {
      data: {
        email,
        first_name,
        last_name,
        name,
        phone_number,
        country_no,
        password,
        subscribe,
      },
      error: {message, errors},
      visibleModal,
      loading,
      user,
      confirmResult,
    } = this.state;
    const visible = visibleModal || !!(!user && confirmResult);
    return (
      <ThemeConsumer>
        {({theme}) => (
          <ThemedView isFullView>
            <Loading visible={pending} />
            <KeyboardAvoidingView behavior="height" style={styles.keyboard}>
              <ScrollView
                style={{marginTop: 40}}
                showsVerticalScrollIndicator={false}>
                <Container style={{paddingHorizontal: 22}}>
                  <View style={{marginTop: 20}}>
                    <Text
                      style={{fontSize: 26, fontWeight: 'bold', color: '#000'}}>
                      Create Account,
                    </Text>
                    <Text style={{fontSize: 20, color: 'darkgrey'}}>
                      Sign up to get started!
                    </Text>
                  </View>
                  <View style={{marginTop: 30}}>
                    {message ? (
                      <TextHtml
                        value={message}
                        style={changeColor(theme.colors.error)}
                      />
                    ) : null}
                    <View style={{flex: 1, width: '99%', flexDirection: 'row'}}>
                      <View style={{flex: 1, marginRight: 3}}>
                        <Input
                          label={t('auth:text_input_first_name')}
                          value={first_name}
                          onChangeText={value =>
                            this.changeData({first_name: value})
                          }
                          error={errors && errors.first_name}
                        />
                      </View>
                      <View style={{flex: 1, marginLeft: 3}}>
                        <Input
                          label={t('auth:text_input_last_name')}
                          value={last_name}
                          onChangeText={value =>
                            this.changeData({last_name: value})
                          }
                          error={errors && errors.last_name}
                        />
                      </View>
                    </View>
                    <Input
                      label={t('auth:text_input_user')}
                      value={name}
                      onChangeText={value => this.changeData({name: value})}
                      error={errors && errors.name}
                    />
                    {enablePhoneNumber ? (
                      <InputMobile
                        value={phone_number}
                        initialCountry={INITIAL_COUNTRY}
                        onChangePhoneNumber={({value, code}) =>
                          this.changeData({
                            phone_number: value,
                            country_no: code,
                          })
                        }
                        error={errors && errors.phone_number}
                      />
                    ) : null}
                    <Input
                      label={t('auth:text_input_email')}
                      value={email}
                      onChangeText={value => this.changeData({email: value})}
                      error={errors && errors.email}
                    />
                    <Input
                      label={t('auth:text_input_password')}
                      value={password}
                      secureTextEntry
                      onChangeText={value => this.changeData({password: value})}
                      error={errors && errors.password}
                    />
                    {/*<View style={styles.viewSwitch}>*/}
                    {/*  <Text style={styles.textSwitch} colorSecondary>*/}
                    {/*    {t('auth:text_agree_register')}*/}
                    {/*  </Text>*/}
                    {/*  <Switch*/}
                    {/*    value={subscribe}*/}
                    {/*    onValueChange={value =>*/}
                    {/*      this.changeData({subscribe: value})*/}
                    {/*    }*/}
                    {/*  />*/}
                    {/*</View>*/}
                    <Button
                      title={t('auth:text_register')}
                      onPress={this.handleRegister}
                      loading={loading || pending}
                      buttonStyle={styles.registerBtn}
                    />
                    <SocialMethods style={styles.viewAccount} />
                    <Text
                      medium
                      style={styles.textHaveAccount}
                      onPress={() => navigation.navigate(authStack.login)}>
                      {t('auth:text_already_account') + '. '}
                      <Text
                        style={{
                          color: theme.colors.primary,
                          fontWeight: 'bold',
                        }}>
                        {t('profile:text_signin')}
                      </Text>
                    </Text>
                    <ModalVerify
                      visible={visible}
                      type={'register'}
                      phone={
                        phone_number.includes(country_no)
                          ? phone_number
                          : country_no + phone_number
                      }
                      confirmation={confirmResult}
                      handleVerify={this.register}
                      setModalVisible={visibleNew =>
                        this.setState({
                          visibleModal: visibleNew,
                          loading: false,
                          confirmResult: null,
                        })
                      }
                    />
                  </View>
                </Container>
              </ScrollView>
            </KeyboardAvoidingView>
          </ThemedView>
        )}
      </ThemeConsumer>
    );
  }
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  viewSwitch: {
    marginVertical: margin.big,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textSwitch: {
    flex: 1,
    lineHeight: lineHeights.h4,
    marginRight: margin.large,
  },
  viewAccount: {
    marginBottom: margin.big,
  },
  textHaveAccount: {
    paddingVertical: padding.small,
    marginTop: margin.base,
    marginBottom: margin.big,
    textAlign: 'center',
  },
  registerBtn: {
    marginTop: margin.big + margin.small,
    marginBottom: margin.small,
    borderRadius: borderRadius.big,
  },
});

const mapStateToProps = state => {
  const configs = configsSelector(state);
  return {
    auth: authSelector(state),
    language: languageSelector(state),
    enablePhoneNumber: configs.get('toggleLoginSMS'),
  };
};

export default connect(mapStateToProps)(withTranslation()(RegisterScreen));
