import React, { Component } from 'react';
import { TextInput, Button, StyleSheet, Alert, Text, View, Switch } from 'react-native';
import BaseModal from '../BaseModal';
import { Brain } from '../../Crainium';
import { emailValidator } from '../../utils/emailHelpers';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import getPermission from '../../utils/getPermission';

const style = StyleSheet.create({
    inputStyle: { padding: 10, width: '90%', height: 50, marginBottom: 10, marginRight: 'auto', marginLeft: 'auto', borderRadius: 6, borderColor: 'gray', borderWidth: 0.5, },
    textAreaStyle: { padding: 10, width: '90%', height: 80, marginBottom: 10, marginRight: 'auto', marginLeft: 'auto', borderRadius: 6, borderColor: 'gray', borderWidth: 0.5, },
    buttonStyle: { backgroundColor: '#185CC6', padding: 10, width: '90%',marginTop: 1, marginBottom: 1, marginRight: 'auto', marginLeft: 'auto', borderRadius: 6, }, 
    text: {
        padding: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
      }
});

export default class AccountEditModal extends Component {
    state = {
        username: null,
        firstName: null,
        lastName: null,
        bio: null,
        accountPrivate: null,
        activityStatus: null,
    }

    componentDidMount() {
        const { accountInfo: { accountPrivate, activityStatus, firstName, lastName, bio, username } } = this.props;
        this.setState({ accountPrivate, activityStatus, firstName, lastName, username, bio });
    }

    updateUserAsync = async () => {
        const { accountPrivate, activityStatus, firstName, lastName, username, bio } = this.state;
        const { toggleModal, refreshProfile } = this.props;

        if ( accountPrivate === null || activityStatus === null || firstName === null || lastName === null || username === null || bio === null ) {
            return;
        }

        try {
            if ( username && username !== this.props.accountInfo.username ) {
                const checkUsernameReq = await Brain.checkIfUsernameExists(username);
    
                if (checkUsernameReq) {
                    return Alert.alert('Username already exists');
                }
            }
            const { status } = await Brain.setAccountInfo({ user: Brain.uid, ...this.state });
            if ( 'success' === status ) {
                console.log('SUCCESSFUL');
                this.setState({ username: '', firstName: '', lastName: '', bio: '' });
                await refreshProfile();
                return toggleModal();
            } else {
                return console.log('UNSUCCESSFUL');
            }
        } catch(error) {
            return console.log(error);
        }
        

        // Return to account if not updated.
        return toggleModal();
    }

    render() {
        const { username, firstName, lastName, bio, accountPrivate, activityStatus } = this.state;
        const { modalVisible, toggle, refreshProfile, accountInfo } = this.props;
        const { inputStyle, textAreaStyle } = style;
        return (
            <BaseModal
                modalVisible={modalVisible}
                transparent={false}
                animationType="fade"
                toggle={toggle}
                title="Edit Account"
                closeBtnText="Close"
                customOpenBtn={true}
            >
                <TextInput
                    placeholder={ accountInfo.username ? accountInfo.username : 'Username' }
                    style={inputStyle}
                    onChangeText={input => this.setState({username: input})}
                    value={username}
                    autoCapitalize="none"
                    returnKey="done"
                    placeholderTextColor='#333'
                />
                <TextInput
                    placeholder={ accountInfo.firstName ? accountInfo.firstName : 'First Name' }
                    style={inputStyle}
                    onChangeText={input => this.setState({firstName: input})}
                    value={firstName}
                    autoCapitalize="none"
                    returnKey="done"
                    placeholderTextColor='#333'
                />
                <TextInput
                    placeholder={ accountInfo.lastName ? accountInfo.lastName : 'Last Name' }
                    style={inputStyle}
                    onChangeText={input => this.setState({lastName: input})}
                    value={lastName}
                    autoCapitalize="none"
                    returnKey="done"
                    placeholderTextColor='#333'
                />
                 <TextInput
                    placeholder={ accountInfo.bio ? accountInfo.bio : 'Bio' }
                    multiline={true}
                    numberOfLines={4}
                    style={textAreaStyle}
                    onChangeText={input => this.setState({bio: input})}
                    value={bio}
                    autoCapitalize="none"
                    returnKey="done"
                    placeholderTextColor='#333'
                />
                <View style={{width: '90%', marginLeft: 'auto', marginRight: 'auto', paddingTop: 10, paddingBottom: 20}}>
                    <Text>
                        Private Account
                    </Text>
                    <Switch
                        onValueChange={value => {
                            return this.setState({accountPrivate: value})
                        }}
                        value={accountPrivate}
                    />
                </View>
                <View style={{width: '90%', marginLeft: 'auto', marginRight: 'auto', paddingTop: 20, paddingBottom: 20}}>
                    <Text>
                        Show Account Active
                    </Text>
                    <Switch
                        onValueChange={value => {
                            return this.setState({activityStatus: value})
                        }}
                        value={activityStatus}
                    />
                </View>
                <View style={style.buttonStyle}>
                    <Button
                        title='Update'
                        onPress={this.updateUserAsync}
                        color="#f5f5f5"
                    />
                </View>
                <UploadProfilePic refreshProfile={refreshProfile} toggle={toggle} />
                <UpdateEmail toggleModal={toggle} />
                <View style={style.buttonStyle}>
                    <Button
                        title='Send Password Reset'
                        color='#f5f5f5'
                        onPress={async () => {
                            try {
                                const ref = await Brain.resetPasswordHandler(Brain.currentUser.email);

                                if (ref) {
                                    Alert.alert('Password Reset Sent.');
                                }
                            } catch(error) {
                                console.log(error);
                            }
                        }}
                    />
                </View>
                <View style={style.buttonStyle}>
                    <Button
                        title='Signout'
                        color='#f5f5f5'
                        onPress={async () => {
                            try {
                                await this.props.signOut();
                            } catch(error) {
                                console.log(error)
                            }
                        }}
                    />
                </View>
            </BaseModal>
        );
    }
}

const options = {
    allowsEditing: true,
  };

class UploadProfilePic extends Component {
    state = {}

    selectPhoto = async () => {
        const status = await getPermission(Permissions.CAMERA_ROLL);
        if (status) {
          
            try {
                const result = await ImagePicker.launchImageLibraryAsync(options);

                if (!result.cancelled) {
                    const remoteUri = await Brain.uploadPhotoAsync(result.uri );
                    await Brain.setAccountInfo({ user: Brain.uid, profilePictureUrl: remoteUri })
                    this.props.refreshProfile()
                    return this.props.toggle();
                }
            } catch(error) {
                console.log(error);
            }
          
        }
        return false;
      };
    
      takePhoto = async () => {
        const status = await getPermission(Permissions.CAMERA);
        if (status) {
          const result = await ImagePicker.launchCameraAsync(options);
          if (!result.cancelled) {
            const remoteUri = await Brain.uploadPhotoAsync(result.uri );
            await Brain.setAccountInfo({ user: Brain.uid, profilePictureUrl: remoteUri })
            this.props.refreshProfile()
            return this.props.toggle();
          }
        }
        return false;
      };
    render() {
        return (
            <View style={{ width: '90%', borderRadius: 6, borderColor: 'gray', borderWidth: 0.5, paddingTop: 10, paddingBottom: 10, marginRight: 'auto', marginLeft: 'auto', marginTop: 20, marginBottom: 20}}>
                <Text style={{textAlign: 'center', fontSize: 18}}>
                    Update Profile Pic
                </Text>
                <Text onPress={this.selectPhoto} style={style.text}>
                    Select Photo
                </Text>
                <Text onPress={this.takePhoto} style={style.text}>
                    Take Photo
                </Text>
            </View>
        );
    }
}

class UpdateEmail extends Component {
    state = {
        email: '',
        reEmail: '',
        password: '',
    }

    updateEmailAsync = async () => {
        const { email, reEmail, password } = this.state;

        try {
            const { isEmailValid } = await emailValidator(email);

            if ( ! isEmailValid ) {
                return Alert.alert("Email invalid.");
            }

            if ( email !== reEmail ) {
                return Alert.alert("Email doesn't match.")
            }

            const { status, message = '', code = '' } = await Brain.updateEmail( email, password );

            if ( 'success' === status ) {
                this.setState({ email: '', reEmail: '', password: '' });
                return this.props.toggleModal();
            }

            if ( 'error' === status ) {
                if ( code ) {
                    return Alert.alert(message);
                }
                return Alert.alert('An unknown error occuried.')  
            }
        } catch( error ) {
            console.log(error);
        }
    }

    render() {
        const { email, reEmail, password } = this.state;
        const { inputStyle } = style;
        return (
            <View style={{ width: '90%', borderRadius: 6, borderColor: 'gray', borderWidth: 0.5, paddingTop: 10, paddingBottom: 10, marginRight: 'auto', marginLeft: 'auto', marginTop: 30, marginBottom: 30}}>
            <Text style={{textAlign: 'center', fontSize: 18, marginTop: 5, marginBottom: 20}}>
                Update Email
            </Text>
            <TextInput
                textContentType="emailAddress"
                placeholder='New Email'
                style={inputStyle}
                onChangeText={input => this.setState({email: input})}
                value={email}
                autoCapitalize="none"
                returnKey="done"
                placeholderTextColor='#333'
            />
            <TextInput
                textContentType="emailAddress"
                placeholder='Confirm New Email'
                style={inputStyle}
                onChangeText={input => this.setState({reEmail: input})}
                value={reEmail}
                autoCapitalize="none"
                returnKey="done"
                placeholderTextColor='#333'
            />
            <TextInput
                textContentType="password"
                secureTextEntry
                placeholder='Enter Password'
                style={inputStyle}
                onChangeText={input => this.setState({password: input})}
                value={password}
                autoCapitalize="none"
                returnKey="done"
                placeholderTextColor='#333'
            />
            <View style={style.buttonStyle}>
                <Button
                    title='Update'
                    color='#f5f5f5'
                    onPress={this.updateEmailAsync}
                />
            </View>
            </View>
        );
    }
}