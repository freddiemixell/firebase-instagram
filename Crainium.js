/* eslint-disable class-methods-use-this */
import uuid from 'uuid';
import config from './config';
import shrinkImageAsync from './utils/shrinkImageAsync';
import uploadPhoto from './utils/uploadPhoto';

const firebase = require('firebase');
// Required for side-effects
require('firebase/firestore');

const collectionName = 'snack-SJucFknGX';

class Crainium {
  constructor() {
    firebase.initializeApp(config);
  }

  resetPasswordHandler = async (email) => {
    const auth = firebase.auth();

    if (email === null || typeof email === 'undefined' || !email) {
      return false;
    }

    return auth
      .sendPasswordResetEmail(email)
      .then(() => true)
      .catch(() => false);
  }

  signIn = async ({ email, password }) => firebase.auth()
    .signInWithEmailAndPassword(email, password)
    .catch(() => false);

  signOut = () => firebase.auth().signOut().then(() => true).catch(() => false);

  createUser = async ({
    email,
    password,
    firstName = '',
    lastName = '',
    username = '',
  }) => firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(({ user }) => {
      // Get user id in callback store in database
      const userID = user.uid;
      // Store users meta data
      const userData = {
        firstName,
        lastName,
        username,
        bio: '',
        following: [],
        followers: [],
        profilePictureUrl: '',
        activityStatus: true,
        accountPrivate: false,
        mutedAccounts: [],
        blockedUsers: [],
        blockComments: [],
        allowTags: true,
        searchHistory: [],
        blockAllNotifications: false,
        allowPostNotifications: false,
        allowCommentNotifications: false,
        allowFollowerNotifications: false,
        allowDirectMessageNotifications: false,
        allowEmailNotifications: true,
        allowTextMessageNotifications: true,
        requestedVerification: false,
      };

      this.userCollection.doc(userID).set(userData);

      this.activityCollection.doc(userID).set({ posts: [] });

      this.postsCollection.doc(userID).set({ posts: [] });
    })
    .catch(({ message, code }) => ({ status: 'error', message, code }))

  checkIfUsernameExists = async (username) => {
    const ref = this.userCollection.where('username', '==', username);
    try {
      const querySnapshot = await ref.get();
      // No matches found.
      if (querySnapshot.empty) {
        return false;
      }
      // User found with username
      return true;
    } catch ({ message }) {
      return {
        status: 'error',
        message,
      };
    }
  }

  // Download Data
  getPaged = async ({ size, start }) => {
    let ref = this.collection.orderBy('timestamp', 'desc').limit(size);
    try {
      if (start) {
        ref = ref.startAfter(start);
      }

      const querySnapshot = await ref.get();
      const data = [];
      querySnapshot.forEach((doc) => {
        if (doc.exists) {
          const post = doc.data() || {};

          // Reduce the name
          const user = post.user || {};

          const name = user.deviceName;
          const reduced = {
            key: doc.id,
            name: (name || 'Secret Duck').trim(),
            ...post,
          };
          data.push(reduced);
        }
      });

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      return { data, cursor: lastVisible };
    } catch (error) {
      return false;
    }
  };

  // Upload Data
  uploadPhotoAsync = async (uri) => {
    const path = `${collectionName}/${this.uid}/${uuid.v4()}.jpg`;
    return uploadPhoto(uri, path);
  };

  post = async ({ text, image: localUri }) => {
    try {
      const { uri: reducedImage, width, height } = await shrinkImageAsync(
        localUri,
      );

      const remoteUri = await this.uploadPhotoAsync(reducedImage);
      return this.postsCollection.doc( this.uid ).update({
          posts: firebase.firestore.FieldValue.arrayUnion({
            text,
            uid: this.uid,
            timestamp: this.timestamp,
            imageWidth: width,
            imageHeight: height,
            image: remoteUri,
          })
      });
    } catch (error) {
      return console.log(error.message);
    }
  };

  getAccountInfo = async () => {
    let ref = this.userCollection.doc( this.uid );
    try {
      const doc = await ref.get();

      if ( doc.exists ) {
        return {
          status: 'success',
          accountInfo: doc.data(),
        }
      }

      return {
        status: 'fail',
        message: 'User not found.',
      }
    
    } catch ({ message }) {
      return {
        status: 'error',
        message,
      };
    }
  }

  setAccountInfo = async ({user, ...rest}) => {
    let ref = this.userCollection.doc(user);
    try {
      await ref.set({ ...rest }, { merge: true });
      return {
        status: 'success',
        dataSet: { ...rest }
      }
    } catch ({ message }) {
      return {
        status: 'error',
        message,
      };
    }
  }

  getUserPosts = async () => {
    let ref = this.postsCollection.doc( this.uid );
    try {
      const doc = await ref.get();

      if ( doc.exists ) {
        return {
          status: 'success',
          posts: doc.data(),
        }
      } else {
        return {
          status: 'error',
          message: 'User not found.'
        }
      }
    } catch({message}) {
      return {
        status: 'error',
        message,
      }
    }
  }

  updateEmail = async (email, password) => {
    const credential = firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email, 
      password
  );
    try {
      await this.currentUser.reauthenticateAndRetrieveDataWithCredential( credential );
      await this.currentUser.updateEmail(email);
      return {
        status: 'success',
      }
    } catch({message, code}) {
      return {
        status: 'error',
        code,
        message,
      }
    }
  }

  // Helpers
  get currentUser() {
    return firebase.auth().currentUser;
  }

  get loggedIn() {
    return !firebase.auth().currentUser;
  }

  get collection() {
    return firebase.firestore().collection(collectionName);
  }

  get userCollection() {
    return firebase.firestore().collection('users');
  }

  get activityCollection() {
    return firebase.firestore().collection('activity');
  }

  get postsCollection() {
    return firebase.firestore().collection('posts');
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get timestamp() {
    return Date.now();
  }
}

export const Brain = new Crainium();
