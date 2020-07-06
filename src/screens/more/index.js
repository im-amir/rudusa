import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';

import {StyleSheet, ScrollView, View, Linking} from 'react-native';
import {Header, ThemedView, Text, ListItem} from 'src/components';

import MoreList from './containers/MoreList';
import Container from 'src/containers/Container';
import SocialIcon from 'src/containers/SocialIcon';
import {TextHeader, CartIcon} from 'src/containers/HeaderComponent';

import {authSelector} from 'src/modules/auth/selectors';
import {
  wishListSelector,
  configsSelector,
  languageSelector,
} from 'src/modules/common/selectors';

import {grey5} from 'src/components/config/colors';
import {margin, padding} from 'src/components/config/spacing';
import {mainStack} from '../../config/navigator';

class MoreScreen extends Component {
  icon = name => {
    return {
      name: name,
      size: 18,
      color: grey5,
    };
  };

  handleLinkUrl = url => {
    Linking.openURL(url);
  };

  goPageOther = router => {
    this.props.navigation.navigate(router);
  };

  render() {
    const {
      configs,
      auth: {isLogin},
      t,
    } = this.props;
    const textTitleProps = {
      medium: true,
    };

    return (
      <ThemedView isFullView>
        <Header
          centerComponent={<TextHeader title={t('common:text_more_screen')} />}
          rightComponent={<CartIcon />}
        />
        <ScrollView>
          <Container style={styles.viewContent}>
            <MoreList
              isLogin={isLogin}
              clickPage={this.goPageOther}
              goPhone={this.handleLinkUrl}
              phonenumber={configs.get('phone')}
              navigation={this.props.navigation}
            />
            <View style={styles.viewSocial}>
              <SocialIcon
                light
                raised={false}
                type="facebook"
                style={styles.socialIconStyle}
                iconSize={24}
                onPress={() => this.handleLinkUrl(configs.get('facebook'))}
              />

              <SocialIcon
                light
                raised={false}
                type="instagram"
                style={styles.socialIconStyle}
                iconSize={24}
                onPress={() => this.handleLinkUrl(configs.get('instagram'))}
              />

              <SocialIcon
                light
                raised={false}
                type="twitter"
                style={styles.socialIconStyle}
                iconSize={24}
                onPress={() => this.handleLinkUrl(configs.get('twitter'))}
              />
            </View>
            <ListItem
              title={t('profile:text_terms_conditions')}
              type="underline"
              titleProps={textTitleProps}
              pad={padding.large}
              containerStyle={!isLogin && {borderBottomWidth: 0}}
              onPress={() => this.goPageOther(mainStack.terms_privacy_options)}
            />
          </Container>
        </ScrollView>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  viewContent: {
    marginTop: margin.large,
    marginBottom: margin.big,
  },
  viewSocial: {
    flexDirection: 'row',
    marginVertical: margin.large + 4,
  },
  socialIconStyle: {
    width: 32,
    height: 32,
    margin: 0,
    marginHorizontal: margin.small / 2,
    paddingTop: 0,
    paddingBottom: 0,
  },
});

const mapStateToProps = state => {
  return {
    auth: authSelector(state),
    wishList: wishListSelector(state),
    configs: configsSelector(state),
    language: languageSelector(state),
  };
};

export default connect(mapStateToProps)(withTranslation()(MoreScreen));
