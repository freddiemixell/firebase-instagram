import React, { Component } from 'react';
import { Text, TextInput, Button, StyleSheet } from 'react-native';
import BaseModal from '../BaseModal';
import { Brain } from '../../Crainium';

const style = StyleSheet.create({
    inputStyle: { padding: 10, width: '90%', height: 50, marginBottom: 10, marginRight: 'auto', marginLeft: 'auto', borderRadius: 6, borderColor: 'gray', borderWidth: 1, },
    openBtnStyle: {},
});

export default class AccountEditModal extends Component {
    state = {
        usernameUpdate: '',
        loading: '',
    }

    updateUsernameAsync = async () => {
        const { username } = this.state;

        if (username) {
            return Brain.setAccountInfo({ user: Brain.uid, username, });
        }

        return false;
    }

    render() {
        const { username, } = this.state;
        const { modalVisible, toggle, } = this.props;
        const { inputStyle, openBtnStyle } = style;
        return (
            <BaseModal
                modalVisible={modalVisible}
                transparent={false}
                animationType="slide"
                toggle={toggle}
                title="Edit Account"
                closeBtnText="Close"
                openBtnText="Forgot Password"
                openBtnStyle={openBtnStyle}
            >
                <TextInput
                    placeholder={'Username'}
                    style={inputStyle}
                    onChangeText={newUsername => this.setState({username: newUsername})}
                    value={username}
                    autoCapitalize="none"
                    returnKey="done"
                />
                <Button
                    title='Update'
                    onPress={this.updateUsernameAsync}
                />
            </BaseModal>
        );
    }
}