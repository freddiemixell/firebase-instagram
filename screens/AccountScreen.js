import React from 'react';
import { AsyncStorage } from 'react-native';
import { shape, func } from 'prop-types';
import { Brain } from '../Crainium';
import BaseScreen from '../components/BaseScreen';
import AccountHeader from '../components/Account/AccountHeader';
import AccountStats from '../components/Account/AccountStats';
import AccountFeed from '../components/Images/AccountFeed';
import Loading from '../components/Loading';

export default class AccountScreen extends React.Component {
    static propTypes = {
      navigation: shape({ navigate: func.isRequired }).isRequired,
    }

    state = {
      accountInfo: {},
      posts: [],
      errors: [],
      loading: false,
    }

    signOutAsync = async () => {
      const { navigation: { navigate } } = this.props;
      Brain.signOut();
      await AsyncStorage.clear();
      return navigate('Auth');
    };

    async componentDidMount() {
      this.setState({ loading: true });
      try {
        const { accountInfo } = await Brain.getAccountInfo();
        const { posts } = await Brain.getUserPosts();
        return this.setState({ accountInfo, ...posts, loading: false });
      } catch ({message}) {
        console.log(message);
        return this.setState(prevState => ({ errors: [...prevState.errors, message], loading: false }))
      }
    }

    async componentDidUpdate() {
      try {
        const { posts } = await Brain.getUserPosts();
        return this.setState({...posts});
      } catch ({message}) {
        console.log(message);
        return this.setState(prevState => ({ errors: [...prevState.errors, message], loading: false }))
      }
    }

    render() {
      const { loading } = this.state;

      return typeof loading === 'undefined' || loading
        ? (
          <Loading/>
        )
        : (
          <BaseScreen layout='default'>
            <AccountHeader { ...this.state } signOut={() => this.signOutAsync} />
            <AccountStats { ...this.state } />
            {/* <Button
              title="Sign Out"
              onPress={this.signOutAsync}
            /> */}
            <AccountFeed {...this.state}/>
          </BaseScreen>
        );
    }
}
