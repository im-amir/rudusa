import React from 'react';
import {useTranslation, withTranslation} from 'react-i18next';

import {StyleSheet} from 'react-native';
import {Text, ListItem, ThemeConsumer} from 'src/components';

import {margin, padding} from 'src/components/config/spacing';
import {mainStack} from 'src/config/navigator';
import {signOut} from '../../../modules/auth/actions';
import {connect} from 'react-redux';
import Container from '../../../containers/Container';

const InformationMe = ({isLogin, clickPage, signOut, navigation}) => {
  const handleLogout = () => {
    signOut();
    navigation.goBack();
  };
  const {t} = useTranslation();
  if (!isLogin) {
    return null;
  }
  const textTitleProps = {
    medium: true,
  };

  return (
    <ThemeConsumer>
      {({theme}) => (
        <>
          <Text medium style={styles.title} colorFourth>
            {t('profile:text_title_information')}
          </Text>
          <ListItem
            leftIcon={{
              name: 'edit',
              type: 'antdesign',
              color: theme.colors.textColorFourth,
              size: 22,
            }}
            title={t('profile:text_edit_account')}
            titleProps={textTitleProps}
            chevron
            type="underline"
            onPress={() => navigation.navigate(mainStack.edit_account)}
          />
          <ListItem
            leftIcon={{
              name: 'lock',
              type: 'fontawesome',
              color: theme.colors.textColorFourth,
              size: 22,
            }}
            title={t('profile:text_password')}
            titleProps={textTitleProps}
            chevron
            type="underline"
            onPress={() => navigation.navigate(mainStack.change_password)}
          />
          <ListItem
            leftIcon={{
              name: 'file-document-box',
              type: 'material-community',
              color: theme.colors.textColorFourth,
              size: 22,
            }}
            title={t('common:text_orders')}
            type="underline"
            titleProps={textTitleProps}
            chevron
            pad={padding.large}
            onPress={() => clickPage(mainStack.order_list)}
          />
          <ListItem
            leftIcon={{
              name: 'book',
              type: 'antdesign',
              color: theme.colors.textColorFourth,
              size: 22,
            }}
            title={t('profile:text_address')}
            titleProps={textTitleProps}
            chevron
            type="underline"
            onPress={() => navigation.navigate(mainStack.address_book)}
          />
          <ListItem
            leftIcon={{
              name: 'logout',
              type: 'antdesign',
              color: theme.colors.textColorFourth,
              size: 22,
            }}
            title={t('profile:text_signout')}
            titleProps={textTitleProps}
            type="underline"
            onPress={handleLogout}
          />
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
  itemEnd: {
    borderBottomWidth: 0,
  },
});

InformationMe.defaultProps = {
  isLogin: false,
  clickPage: () => {},
};
const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(signOut()),
});

export default connect(
  null,
  mapDispatchToProps,
)(withTranslation()(InformationMe));
