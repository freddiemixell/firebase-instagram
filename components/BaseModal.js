import React from 'react';
import {
  Modal, View, ScrollView, Button, Text, StyleSheet, ViewPropTypes,
} from 'react-native';
import {
  string, bool, func, arrayOf, node,
} from 'prop-types';

const style = StyleSheet.create({
  containerStyle: {
    flexGrow: 1, paddingTop: 100, paddingBottom: 100
  },
  titleStyle: { textAlign: 'center', marginBottom: 10, fontSize: 18 },
  modalStyle: { width: '100%' },
});

function BaseModal(props) {
  const {
    title,
    closeBtnText,
    openBtnText,
    openBtnStyle,
    modalVisible,
    children,
    transparent,
    animationType,
    toggle,
    customOpenBtn
  } = props;

  const {
    modalStyle,
    containerStyle,
    titleStyle,
  } = style;

  const maybeShowTitle = title
    ? <Text style={titleStyle}>{ title }</Text>
    : null;

  return (
    <>
      <Modal
        animationType={animationType}
        transparent={transparent}
        visible={modalVisible}
        style={modalStyle}
        onRequestClose={() => toggle()}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={containerStyle}
        >
          { maybeShowTitle }
          { children }
          <Button
            title={closeBtnText || 'Close'}
            onPress={() => toggle()}
          />
        </ScrollView>
      </Modal>
      {
        ! customOpenBtn
        ? (
          <View style={openBtnStyle}>
            <Button
              title={openBtnText}
              onPress={() => toggle()}
            />
          </View>
        )
        : null
      }
    </>
  );
}

BaseModal.propTypes = {
  modalVisible: bool.isRequired,
  toggle: func.isRequired,
  children: arrayOf(node),
  openBtnText: string,
  openBtnStyle: ViewPropTypes.style,
  closeBtnText: string,
  title: string,
  transparent: bool,
  animationType: string,
};

BaseModal.defaultProps = {
  children: null,
  openBtnText: 'Open',
  openBtnStyle: {},
  closeBtnText: 'Close',
  title: '',
  transparent: false,
  animationType: 'slide',
};

export default React.memo(BaseModal);
