import React from 'react';
import {connect} from 'react-redux';

import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useTranslation} from 'react-i18next';
import {StyleSheet, ScrollView, View, Image} from 'react-native';
import {ThemedView, Text, ListItem} from 'src/components';
import ItemCategoryMenu from './ItemCategoryMenu';

import {categorySelector} from 'src/modules/category/selectors';
import {configsSelector, languageSelector} from 'src/modules/common/selectors';

import {padding, margin} from 'src/components/config/spacing';

import {mainStack, homeTabs} from 'src/config/navigator';
import {excludeCategory} from '../utils/category';
import {exclude_categories_sidebar} from 'src/config/category';
import {DrawerActions} from '@react-navigation/compat';

const Sidebar = props => {
  const {t} = useTranslation();
  const {category, configs, language, navigation} = props;
  const handlePage = (router, params = {}) => {
    if (!navigation) {
      return null;
    }
    navigation.dispatch(DrawerActions.closeDrawer());
    navigation.navigate(router, params);
  };
  const dataHelpInfo = [
    {
      id: '4',
      name: t('common:text_home'),
      router: homeTabs.home_drawer,
    },
    {
      id: '5',
      name: t('common:text_blogs'),
      router: mainStack.blogs,
    },
    {
      id: '6',
      name: t('common:text_about'),
      router: mainStack.page,
      params: {
        type: 'page',
        id: configs.getIn(['about', language]),
      },
    },
    {
      id: '7',
      name: t('profile:text_term'),
      router: mainStack.page,
      params: {
        type: 'page',
        id: configs.getIn(['term', language]),
      },
    },
    {
      id: '8',
      name: t('common:text_privacy_full'),
      router: mainStack.page,
      params: {
        type: 'page',
        id: configs.getIn(['policy', language]),
      },
    },
    {
      id: '9',
      name: 'common:text_contact',
      router: mainStack.contact,
    },
  ];

  const {data} = category;
  // Filter include category
  const _data = excludeCategory(data, exclude_categories_sidebar);

  return (
    <ThemedView isFullView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.logoBoxWrapper, styles.containerUnderline]}>
          <Image
            source={require('src/assets/images/logo_horizontal.png')}
            resizeMode={'contain'}
            style={{width: 150, height: 90}}
          />
        </View>
        <View style={[styles.shortcutsWrapper, styles.containerUnderline]}>
          <ItemCategoryMenu
            key={'2'}
            category={{
              id: '2',
              name: t('common:LogIn/SignUp'),
              router: homeTabs.me,
            }}
            isOpen={
              navigation.state && navigation.state.isDrawerOpen
                ? navigation.state.isDrawerOpen
                : false
            }
            goProducts={params => handlePage(mainStack.products, params)}
            leftIcon={{
              name: 'logout',
              type: 'antdesign',
              color: 'rgba(0,0,0,0.7)',
              size: 20,
            }}
          />
          <ItemCategoryMenu
            key={'3'}
            category={{
              id: '3',
              name: t('common:Blog'),
              router: homeTabs.home_drawer,
            }}
            isOpen={
              navigation.state && navigation.state.isDrawerOpen
                ? navigation.state.isDrawerOpen
                : false
            }
            goProducts={params => handlePage(mainStack.products, params)}
            leftIcon={{
              name: 'wordpress',
              type: 'material-community',
              color: 'rgba(0,0,0,0.7)',
              size: 22,
            }}
          />
        </View>
        <View style={styles.categoriesWrapper}>
          <Text h3 medium style={styles.title}>
            {t('common:text_category')}
          </Text>
          {_data.map(c =>
            c.name.toLowerCase() !== 'uncategorized' ? (
              <ItemCategoryMenu
                key={c.id}
                category={c}
                isCategory={true}
                isOpen={
                  navigation.state && navigation.state.isDrawerOpen
                    ? navigation.state.isDrawerOpen
                    : false
                }
                goProducts={params => handlePage(mainStack.products, params)}
              />
            ) : null,
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: margin.small,
    marginTop: margin.big,
    paddingHorizontal: padding.large + 10,
    color: "darkgrey"
  },
  logoBoxWrapper: {
    paddingTop: getStatusBarHeight() + 20,
    paddingLeft: 10,
  },
  containerUnderline: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderBottomWidth: 1,
    paddingHorizontal: 0,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  categoriesWrapper: {},
  shortcutsWrapper: {
    paddingVertical: 20,
  },
});

const mapStateToProps = state => ({
  category: categorySelector(state),
  configs: configsSelector(state),
  language: languageSelector(state),
});
export default connect(mapStateToProps)(Sidebar);
