import firebase from 'firebase';
import React from 'react';
import {
  View, Button, Text, AsyncStorage, StyleSheet,
} from 'react-native';
import { shape, func } from 'prop-types';
import { Brain } from '../Crainium';
import BaseScreen from '../components/BaseScreen';

const style = StyleSheet.create({
  logoStyle: {
    textAlign: 'center', fontSize: 50, marginBottom: 30, marginTop: 'auto',
  },
  loginStyle: {
    backgroundColor: '#185CC6', padding: 10, width: '90%', marginRight: 'auto', marginLeft: 'auto', borderRadius: 6,
  },
  accountStyle: { marginTop: 30, marginBottom: 'auto' },
});

export default class WelcomeScreen extends React.Component {
    static navigationOptions = {
      header: null,
    }

    static propTypes = {
      navigation: shape({ navigate: func.isRequired }).isRequired,
    }

    // Functions and state to control this screen and children.
    state = {
      modalVisible: false,
      resetEmail: '',
      setResetEmail: resetEmail => this.setState({ resetEmail }),
      toggleModal: () => this.setState(prevState => ({ modalVisible: !prevState.modalVisible })),
      authListener: () => {
        const { navigation: { navigate } } = this.props;

        firebase.auth().onAuthStateChanged(async (user) => {
          if (user) {
            // Do logged in stuff
            await AsyncStorage.setItem('userToken', Brain.uid);
            return navigate('App');
          }
          return false;
        });
      },
    }

    /**
     * Listening for auth state changed and redirecting.
     */
    componentDidMount() {
      const { authListener } = this.state;
      return authListener();
    }

    /**
     * Cleaning up and removing listener when we're out.
     */
    componentWillUnmount() {
      return this.setState({ authListener: null });
    }

    render() {
      const {
        navigation: { navigate },
      } = this.props;

      const {
        logoStyle,
        loginStyle,
        accountStyle,
      } = style;

      return (
        <BaseScreen layout="center">
          <Text style={logoStyle}>
            Finsta 🔥
          </Text>
          <View style={loginStyle}>
            <Button
              title="Login"
              onPress={() => navigate('SignIn')}
              color="#f5f5f5"
            />
          </View>
          <View style={accountStyle}>
            <Button
              title="Create Account"
              onPress={() => navigate('SignUp')}
            />
          </View>
        </BaseScreen>
      );
    }
}
