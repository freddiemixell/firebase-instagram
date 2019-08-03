import React from 'react';
import { Modal, View, Button, Text, StyleSheet } from 'react-native';
import { string, bool, func, any } from 'prop-types';

const style = StyleSheet.create({
    containerStyle: { position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center' },
    titleStyle: { textAlign: 'center', marginBottom: 10, fontSize: 18 },
    modalStyle: { width: '100%' },
});

export default function BaseModal( props ) {

    const {
        title,
        closeBtnText,
        modalVisible,
        children,
        transparent,
        animationType,
        toggle,
    } = props;

    const {
        modalStyle,
        containerStyle,
        titleStyle,
    } = style;

    const maybeShowTitle = title
        ? <Text style={ titleStyle }>{ title }</Text>
        : null;

    return (
        <Modal
            animationType={ animationType }
            transparent={ transparent }
            visible={ modalVisible }
            style={ modalStyle }
            onRequestClose={ () => toggle( ! modalVisible ) }
        >
            <View
                style={ containerStyle }
            >
                { maybeShowTitle }
                { children }
                <Button
                    title={ closeBtnText ? closeBtnText : 'Close' }
                    onPress={ () => toggle( ! modalVisible ) }
                />
            </View>
        </Modal>
    );
}

BaseModal.propTypes = {
    modalVisible: bool.isRequired,
    toggle: func.isRequired,
    children: any,
    closeBtnText: string,
    title: string,
    transparent: bool,
    animationType: string,
}

BaseModal.defaultProps = {
    children: null,
    closeBtnText: 'Close',
    title: '',
    transparent: false,
    animationType: 'slide',
}
