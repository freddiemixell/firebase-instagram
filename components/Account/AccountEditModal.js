import React, { Component } from 'react';
import { TextInput, Button, StyleSheet, Alert, Text, View, Switch } from 'react-native';
import BaseModal from '../BaseModal';
import { Brain } from '../../Crainium';
import { emailValidator } from '../../utils/emailHelpers';

const style = StyleSheet.create({
    inputStyle: { padding: 10, width: '90%', height: 50, marginBottom: 10, marginRight: 'auto', marginLeft: 'auto', borderRadius: 6, borderColor: 'gray', borderWidth: 0.5, },
    textAreaStyle: { padding: 10, width: '90%', height: 80, marginBottom: 10, marginRight: 'auto', marginLeft: 'auto', borderRadius: 6, borderColor: 'gray', borderWidth: 0.5, },
});

export default class AccountEditModal extends Component {
    state = {
        username: '',
        firstName: '',
        lastName: '',
        bio: '',
        accountPrivate: null,
    }

    componentDidMount() {
        const { accountInfo: { accountPrivate } } = this.props;
        this.setState({ accountPrivate });
    }

    updateUserAsync = async () => {
        const { username, firstName, lastName, bio, accountPrivate } = this.state;
        const { toggleModal, refreshProfile } = this.props;

        // Make an exact copy of state that we can filter.
        let setAccount = { ...this.state };

        // Only update what's filled out.
        for (let key in setAccount) {
            if( key !== 'accountPrivate' && ! setAccount[key] ) {
                delete setAccount[key];
            }
        }

        try {
            if ( username ) {
                const checkUsernameReq = await Brain.checkIfUsernameExists(username);
    
                if (checkUsernameReq) {
                    return Alert.alert('Username already exists');
                }
            }
            const { status } = await Brain.setAccountInfo({ user: Brain.uid, ...setAccount });
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
        const { username, firstName, lastName, bio, accountPrivate } = this.state;
        const { modalVisible, toggle } = this.props;
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
                    placeholder={'Username'}
                    style={inputStyle}
                    onChangeText={input => this.setState({username: input})}
                    value={username}
                    autoCapitalize="none"
                    returnKey="done"
                    placeholderTextColor='#333'
                />
                <TextInput
                    placeholder='First Name'
                    style={inputStyle}
                    onChangeText={input => this.setState({firstName: input})}
                    value={firstName}
                    autoCapitalize="none"
                    returnKey="done"
                    placeholderTextColor='#333'
                />
                <TextInput
                    placeholder='Last Name'
                    style={inputStyle}
                    onChangeText={input => this.setState({lastName: input})}
                    value={lastName}
                    autoCapitalize="none"
                    returnKey="done"
                    placeholderTextColor='#333'
                />
                 <TextInput
                    placeholder='Bio'
                    multiline={true}
                    numberOfLines={4}
                    style={textAreaStyle}
                    onChangeText={input => this.setState({bio: input})}
                    value={bio}
                    autoCapitalize="none"
                    returnKey="done"
                    placeholderTextColor='#333'
                />
                <Switch
                    onValueChange={accountPrivate => {
                        return this.setState({accountPrivate})
                    }}
                    value={accountPrivate}
                />
                <Button
                    title='Update'
                    onPress={this.updateUserAsync}
                />
                <UpdateEmail toggleModal={toggle} />
                <View>
                    <Button
                        title='Send Password Reset'
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
                <Button
                    title='Signout'
                    onPress={async () => {
                        try {
                            await this.props.signOut();
                        } catch(error) {
                            console.log(error)
                        }
                    }}
                />
            </BaseModal>
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
            <>
            <Text>
                Update Email
            </Text>
            <TextInput
                textContentType="emailAddress"
                placeholder='Email'
                style={inputStyle}
                onChangeText={input => this.setState({email: input})}
                value={email}
                autoCapitalize="none"
                returnKey="done"
                placeholderTextColor='#333'
            />
            <TextInput
                textContentType="emailAddress"
                placeholder='Confirm Email'
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
            <Button
                title='Update'
                onPress={this.updateEmailAsync}
            />
            </>
        );
    }
}