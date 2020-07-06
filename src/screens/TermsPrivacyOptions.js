import React, {Component} from 'react';

import {useTranslation} from 'react-i18next';
import {Header, ListItem, ThemeConsumer, ThemedView} from 'src/components';
import {Image, Text} from 'react-native';
import {IconHeader, CartIcon, TextHeader} from 'src/containers/HeaderComponent';
import Container from '../containers/Container';
import {padding} from '../components/config/spacing';
import {mainStack} from '../config/navigator';

class TermsPrivacyOptions extends Component {
  render() {
    const {t, navigation} = this.props;
    const textTitleProps = {
      medium: true,
    };
    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader />}
          centerComponent={<TextHeader title={t('profile:More')} />}
        />
        <Container>
          <ListItem
            title={t('profile:text_and_conditions')}
            type="underline"
            titleProps={textTitleProps}
            pad={padding.large}
            chevron
            onPress={() => navigation.navigate(mainStack.term)}
          />
          <ListItem
            title={t('common:text_privacy')}
            type="underline"
            titleProps={textTitleProps}
            pad={padding.large}
            chevron
            containerStyle={{borderBottomWidth: 0}}
            onPress={() => navigation.navigate(mainStack.privacy)}
          />
        </Container>
      </ThemedView>
    );
  }
}
export default function(props) {
  const {t} = useTranslation();
  return (
    <ThemeConsumer>
      {({theme}) => <TermsPrivacyOptions {...props} t={t} theme={theme} />}
    </ThemeConsumer>
  );
}
