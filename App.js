// Import React Navigation
import {
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer,
} from 'react-navigation';

import tabBarIcon from './utils/tabBarIcon';
// Import the screens
import FeedScreen from './screens/FeedScreen';
import NewPostScreen from './screens/NewPostScreen';
import SelectPhotoScreen from './screens/SelectPhotoScreen';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import SignInScreen from './screens/SignInScreen';
import SignupScreen from './screens/SignupScreen';
import AccountScreen from './screens/AccountScreen';
import EditAccountScreen from './screens/EditAccountScreen';
import WelcomeScreen from './screens/WelcomeScreen';

const navOptions = { title: 'Finsta 🔥', headerStyle: { borderBottomWidth: 0 }, headerBackTitle: 'Back' }

const AccountNavigator = createStackNavigator({
  AccountScreen: {
    screen: AccountScreen,
    navigationOptions: {
      headerStyle: { borderBottomWidth: 0 }
    }
  },
  EditAccount: {
    screen: EditAccountScreen,
    navigationOptions: () => ({
      title: 'Edit Profile',
      headerStyle: { borderBottomWidth: 0 }
    })
  },
});

const FeedNavigator = createStackNavigator({
  FeedScreen:  {
    screen: FeedScreen,
    navigationOptions: navOptions
  },
});

const PhotoNavigator = createStackNavigator({
  SelectPhoto: {
    screen: SelectPhotoScreen,
    navigationOptions: navOptions,
  },
  NewPost: {
    screen: NewPostScreen,
    navigationOptions: {...navOptions, title: 'New Post'}
  }
});

// Create our main tab navigator for moving between the Feed and Photo screens
const navigator = createBottomTabNavigator(
  {
    // The name `Feed` is used later for accessing screens
    Feed: {
      // Define the component we will use for the Feed screen.
      screen: FeedNavigator,
      navigationOptions: {
        tabBarIcon: tabBarIcon('home'),
      },
    },
    // All the same stuff but for the Photo screen
    Photo: {
      screen: PhotoNavigator,
      navigationOptions: {
        tabBarIcon: tabBarIcon('add-circle'),
      },
    },
    Account: {
      screen: AccountNavigator,
      navigationOptions: {
        tabBarIcon: tabBarIcon('perm-identity'),
      },
    },
  },
  {
    // We want to hide the labels and set a nice 2-tone tint system for our tabs
    tabBarOptions: {
      showLabel: false,
      activeTintColor: 'black',
      inactiveTintColor: 'gray',
    },
  },
);

// Create the navigator that pushes high-level screens like the `NewPost` screen.
const AppStack = createStackNavigator(
  {
    Main: navigator,
  },
  {
    cardStyle: { backgroundColor: 'white' },
    headerMode: 'none'
  },
);

const AuthStack = createStackNavigator(
  {
    Home: WelcomeScreen,
    SignIn: SignInScreen,
    SignUp: SignupScreen,
  },
);

const AppContainer = createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  },
));

// Export it as the root component
export default AppContainer;
