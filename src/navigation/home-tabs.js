import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeDrawer from './home-drawer';
import Me from 'src/screens/profile/me';
import More from 'src/screens/more';
import Cart from 'src/screens/cart/cart';
import ListOrder from 'src/screens/profile/orders';
import Explorer from 'src/screens/map-explorer';
import Tabbar from 'src/containers/Tabbar';

import {homeTabs} from 'src/config/navigator';

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <Tabbar {...props} />}
      initialRouteName={homeTabs.home_drawer}>
      <Tab.Screen name={homeTabs.orders} component={ListOrder} />
      <Tab.Screen name={homeTabs.cart} component={Cart} />
      <Tab.Screen name={homeTabs.home_drawer} component={HomeDrawer} />
      <Tab.Screen name={homeTabs.me} component={Me} />
      <Tab.Screen name={homeTabs.more} component={More} />
    </Tab.Navigator>
  );
}
