import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ListItem, Icon} from 'src/components';
import {padding} from 'src/components/config/spacing';
import unescape from 'lodash/unescape';

import {excludeCategory} from '../utils/category';
import {exclude_categories_sidebar} from 'src/config/category';

class ItemCategoryMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowSub: false,
    };
  }
  componentDidUpdate(preProps) {
    if (preProps.isOpen && !this.props.isOpen) {
      this.updateShowSub(false);
    }
  }
  updateShowSub = value => {
    this.setState({
      isShowSub: value,
    });
  };

  handleGoProducts = category => {
    const params = {
      id: category.id,
      name: unescape(category.name),
    };
    this.props.goProducts(params);
  };

  render() {
    const {category, leftIcon, isCategory} = this.props;
    const {isShowSub} = this.state;
    if (!category) {
      return null;
    }

    const {categories} = category;
    const data = excludeCategory(categories, exclude_categories_sidebar);

    return (
      <>
        <ListItem
          title={unescape(category.name)}
          titleProps={{
            medium: true,
          }}
          titleStyle={[
            styles.textItem,
            {
              textTransform: isCategory ? 'uppercase' : 'capitalize',
              fontSize: isCategory ? 15 : 16,
            },
          ]}
          animation={true}
          leftIcon={leftIcon}
          rightElement={
            data.length > 0 && (
              <Icon
                name={
                  isShowSub ? 'keyboard-arrow-right' : 'keyboard-arrow-down'
                }
                size={22}
                type={'material'}
                iconStyle={styles.icon}
                activeOpacity={1}
                underlayColor={'transparent'}
                onPress={() => this.updateShowSub(!isShowSub)}
              />
            )
          }
          containerStyle={{backgroundColor: 'transparent'}}
          small
          onPress={() => this.handleGoProducts(category)}
        />
        {data.length > 0 && isShowSub && (
          <View style={styles.viewSubs}>
            {data.map(subC => (
              <ListItem
                key={subC.id}
                title={unescape(subC.name)}
                titleProps={{
                  medium: true,
                }}
                small
                containerStyle={styles.itemSub}
                onPress={() => this.handleGoProducts(subC)}
              />
            ))}
          </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  textItem: {
    paddingHorizontal: padding.large,
    fontFamily: 'VarelaRound-Regular',
  },
  icon: {
    padding: padding.large,
  },
  viewSubs: {
    paddingLeft: padding.large,
  },
  itemSub: {
    paddingHorizontal: padding.large,
    backgroundColor: 'transparent',
  },
});

ItemCategoryMenu.defaultProps = {
  subCategories: [],
  isOpen: false,
  goProducts: () => {},
};

export default ItemCategoryMenu;
