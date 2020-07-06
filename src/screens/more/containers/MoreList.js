import React from 'react';
import {useTranslation} from 'react-i18next';

import {StyleSheet, Switch, Image} from 'react-native';
import {Text, ListItem, Badge, ThemeConsumer} from 'src/components';

import {margin, padding} from 'src/components/config/spacing';
import {mainStack} from 'src/config/navigator';
import {connect} from 'react-redux';
import {signOut} from 'src/modules/auth/actions';
import {themeSelector, wishListSelector} from 'src/modules/common/selectors';
import {DARK} from '../../../modules/common/constants';
import {ENABLE_CONFIG_DEMO} from '../../../config/development';
import Container from '../../../containers/Container';
import {switchMode} from '../../../modules/common/actions';

const MoreList = ({
  isLogin,
  wishList,
  phonenumber,
  clickPage,
  goPhone,
  handleSignOut,
  navigation,
  switchMode,
}) => {
  const {t} = useTranslation();
  const textTitleProps = {
    medium: true,
  };
  const titleProps = {
    medium: true,
  };
  return (
    <ThemeConsumer>
      {({theme}) => (
        <>
          <ListItem
            leftIcon={
              <Image
                source={require('src/assets/images/dark_more.png')}
                style={{width: 25, height: 25}}
                resizeMode={'contain'}
              />
            }
            title={t('profile:text_dark')}
            type="underline"
            titleProps={titleProps}
            rightElement={
              <Switch value={theme === DARK} onValueChange={switchMode} />
            }
          />
          {ENABLE_CONFIG_DEMO && (
            <ListItem
              title={'Test Store'}
              type="underline"
              titleProps={titleProps}
              onPress={() => navigation.navigate(mainStack.demo_config)}
            />
          )}
          <ListItem
            leftIcon={
              <Image
                source={require('src/assets/images/heart.jpg')}
                style={{width: 25, height: 25}}
                resizeMode={'contain'}
              />
            }
            title={t('common:text_wishList')}
            type="underline"
            titleProps={textTitleProps}
            pad={padding.large}
            rightElement={
              <Badge
                value={wishList.size}
                badgeStyle={styles.badge}
                textStyle={styles.textBadge}
              />
            }
            onPress={() => clickPage(mainStack.wish_list)}
          />
          <ListItem
            leftIcon={
              <Image
                source={require('src/assets/images/settings.png')}
                style={{width: 25, height: 25}}
                resizeMode={'contain'}
              />
            }
            title={t('common:text_setting')}
            type="underline"
            titleProps={textTitleProps}
            pad={padding.large}
            chevron
            onPress={() => clickPage(mainStack.setting)}
          />
          <ListItem
            leftIcon={
              <Image
                source={require('src/assets/images/question.png')}
                style={{width: 25, height: 25}}
                resizeMode={'contain'}
              />
            }
            title={t('common:text_help_info')}
            type="underline"
            titleProps={textTitleProps}
            chevron
            pad={padding.large}
            onPress={() => clickPage(mainStack.help)}
          />
          <ListItem
            leftIcon={
              <Image
                source={require('src/assets/images/hotline.png')}
                style={{width: 25, height: 25}}
                resizeMode={'contain'}
              />
            }
            title={t('profile:text_hotline')}
            rightElement={
              <Text colorSecondary style={styles.phone}>
                {phonenumber}
              </Text>
            }
            type="underline"
            titleProps={textTitleProps}
            pad={padding.large}
            containerStyle={!isLogin}
            onPress={() => goPhone(`tel:${phonenumber}`)}
          />
          <ListItem
            leftIcon={
              <Image
                source={require('src/assets/images/contact-us.png')}
                style={{width: 25, height: 25}}
                resizeMode={'contain'}
              />
            }
            title={t('profile:text_contact')}
            type="underline"
            titleProps={textTitleProps}
            chevron
            pad={padding.large}
            onPress={() => clickPage(mainStack.contact)}
          />
          <ListItem
            leftIcon={
              <Image
                source={require('src/assets/images/info.png')}
                style={{width: 25, height: 25}}
                resizeMode={'contain'}
              />
            }
            title={t('common:text_about')}
            type="underline"
            titleProps={textTitleProps}
            chevron
            pad={padding.large}
            onPress={() => clickPage(mainStack.about)}
          />
          {isLogin && (
            <ListItem
              leftIcon={{
                name: 'logout-variant',
                type: 'material-community',
                color: theme.colors.textColorFourth,
                size: 22,
              }}
              title={t('profile:text_signout')}
              type="underline"
              titleProps={textTitleProps}
              pad={padding.large}
              containerStyle={styles.itemEnd}
              onPress={handleSignOut}
            />
          )}
        </>
      )}
    </ThemeConsumer>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: margin.big + 4,
    marginBottom: margin.small,
  },
  phone: {
    marginHorizontal: margin.small / 2,
    fontWeight: 'bold',
  },
  itemEnd: {
    borderBottomWidth: 0,
  },
  badge: {
    height: 20,
    minWidth: 20,
    borderRadius: 10,
  },
  textBadge: {
    fontSize: 9,
  },
});

MoreList.defaultProps = {
  isLogin: false,
  phonenumber: '',
  clickPage: () => {},
  goPhone: () => {},
};

const mapStateToProps = state => ({
  wishList: wishListSelector(state),
  theme: themeSelector(state),
});
const mapDispatchToProps = dispatch => ({
  handleSignOut: signOut,
  switchMode: () => dispatch(switchMode()),
});
export default connect(mapStateToProps, mapDispatchToProps)(MoreList);
