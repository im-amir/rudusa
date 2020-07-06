import React from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {StyleSheet, ScrollView, View, KeyboardAvoidingView} from 'react-native';
import {Header, Divider, Text, ThemedView, ThemeConsumer} from 'src/components';
import Container from 'src/containers/Container';
import Input from 'src/containers/input/Input';
import Button from 'src/containers/Button';
import TextHtml from 'src/containers/TextHtml';
import {TextHeader, IconHeader} from 'src/containers/HeaderComponent';
import SocialMethods from './containers/SocialMethods';

import {rootSwitch, authStack} from 'src/config/navigator';

import {signInWithEmail} from 'src/modules/auth/actions';
import {authSelector} from 'src/modules/auth/selectors';
import {requiredLoginSelector} from 'src/modules/common/selectors';
import {borderRadius, margin, padding} from 'src/components/config/spacing';

import {changeColor} from 'src/utils/text-html';

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  handleLogin = () => {
    const {username, password} = this.state;
    this.props.dispatch(signInWithEmail({username, password}));
  };

  render() {
    const {
      navigation,
      auth: {pending, loginError},
      requiredLogin,
      t,
    } = this.props;
    const {username, password} = this.state;
    const {message, errors} = loginError;

    return (
      <ThemeConsumer>
        {({theme}) => (
          <ThemedView isFullView>
            <KeyboardAvoidingView behavior="height" style={styles.keyboard}>
              <ScrollView
                style={{marginTop: 40}}
                showsVerticalScrollIndicator={false}>
                <Container style={{paddingHorizontal: 22}}>
                  <View style={{marginTop: 20}}>
                    <Text
                      style={{fontSize: 26, fontWeight: 'bold', color: '#000'}}>
                      Welcome,
                    </Text>
                    <Text style={{fontSize: 20, color: 'darkgrey'}}>
                      Sign in to continue!
                    </Text>
                  </View>
                  <View style={{marginTop: 40}}>
                    {message ? (
                      <TextHtml
                        value={message}
                        style={changeColor(theme.colors.error)}
                      />
                    ) : null}
                    <Input
                      label={t('auth:text_input_email_address')}
                      value={username}
                      onChangeText={value => this.setState({username: value})}
                      error={errors && errors.username}
                    />
                    <Input
                      label={t('auth:text_input_password')}
                      value={password}
                      secureTextEntry
                      onChangeText={value => this.setState({password: value})}
                      error={errors && errors.password}
                    />
                    <Text
                      onPress={() => navigation.navigate(authStack.forgot)}
                      style={styles.textForgot}
                      medium>
                      {t('auth:text_forgot')}
                    </Text>
                    <Button
                      title={t('common:text_login')}
                      loading={pending}
                      onPress={this.handleLogin}
                      containerStyle={styles.margin}
                      buttonStyle={styles.loginBtn}
                      raised={true}
                    />
                    <SocialMethods style={styles.viewSocial} />
                    <Text
                      medium
                      style={styles.textAccount}
                      onPress={() => navigation.navigate(authStack.register)}>
                      {t('auth:text_have_account') + '. '}
                      <Text
                        style={{
                          color: theme.colors.primary,
                          fontWeight: 'bold',
                        }}>
                        {t('auth:text_register')}
                      </Text>
                    </Text>
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
  textForgot: {
    textAlign: 'right',
    marginTop: 5,
    marginBottom: margin.big,
  },
  viewOr: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divOr: {
    flex: 1,
  },
  textOr: {
    marginHorizontal: margin.base,
  },
  margin: {
    marginVertical: margin.small,
  },
  viewSocial: {
    marginBottom: margin.small,
  },
  loginBtn: {
    borderRadius: borderRadius.big,
  },
  textAccount: {
    paddingVertical: padding.small,
    marginTop: margin.large * 2,
    marginBottom: margin.base,
    textAlign: 'center',
  },
});

const mapStateToProps = state => {
  return {
    auth: authSelector(state),
    requiredLogin: requiredLoginSelector(state),
  };
};

export default connect(mapStateToProps)(withTranslation()(LoginScreen));
