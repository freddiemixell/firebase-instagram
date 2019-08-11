import React, { Component } from 'react';
import { TextInput, Button, StyleSheet } from 'react-native';
import BaseModal from '../BaseModal';
import { Brain } from '../../Crainium';

const style = StyleSheet.create({
    inputStyle: { padding: 10, width: '90%', height: 50, marginBottom: 10, marginRight: 'auto', marginLeft: 'auto', borderRadius: 6, borderColor: 'gray', borderWidth: 1, },
});

export default class AccountEditModal extends Component {
    state = {
        username: '',
        firstName: '',
        lastName: '',
    }

    updateUserAsync = async () => {
        const { username, firstName, lastName } = this.state;

        // Make an exact copy of state that we can filter.
        let setAccount = { ...this.state };

        // Only update what's filled out.
        for (let key in setAccount) {
            if( ! setAccount[key] ) {
                delete setAccount[key];
            }
        }

        // Check if any of our values are set, if so update.
        if ( username || firstName || lastName ) {
            try {
                const { status } = await Brain.setAccountInfo({ user: Brain.uid, ...setAccount });
                if ( 'success' === status ) {
                    console.log('SUCCESSFUL');
                    this.setState({ username: '', firstName: '', lastName: '', });
                    return this.props.toggleModal();
                } else {
                    return console.log('UNSUCCESSFUL');
                }
            } catch(error) {
                return console.log(error);
            }
            
        }

        // Return to account if not updated.
        return this.props.toggleModal();
    }

    render() {
        const { username, firstName, lastName } = this.state;
        const { modalVisible, toggle, } = this.props;
        const { inputStyle } = style;
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
                />
                <TextInput
                    placeholder='First Name'
                    style={inputStyle}
                    onChangeText={input => this.setState({firstName: input})}
                    value={firstName}
                    autoCapitalize="none"
                    returnKey="done"
                />
                <TextInput
                    placeholder='Last Name'
                    style={inputStyle}
                    onChangeText={input => this.setState({lastName: input})}
                    value={lastName}
                    autoCapitalize="none"
                    returnKey="done"
                />
                <Button
                    title='Update'
                    onPress={this.updateUserAsync}
                />
            </BaseModal>
        );
    }
}