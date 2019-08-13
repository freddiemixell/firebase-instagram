import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

const style = StyleSheet.create({
    headerStyle: { justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center', height: 150 },
    profilePicStyle: { width: 90, height: 90, borderRadius: 90/2 },
    usernameTextStyle: { fontSize: 20 },
    usernameSectionStyle: {flex: 1, width: '100%', justifyContent: 'flex-end'},
    bioTextStyle: { lineHeight: 25 },
    bioSectionStyle: { flex: 1, width: '100%', justifyContent: 'center' },
    headerRightStyle: { flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center' },
    headerLeftStyle: { flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center' },
});

function AccountHeader(props) {
    const { toggleModal, accountInfo: { profilePictureUrl, firstName, lastName, bio } } = props;

    const { headerStyle, headerRightStyle, headerLeftStyle, profilePicStyle, usernameTextStyle, bioTextStyle, bioSectionStyle, usernameSectionStyle } = style;
    const uri = profilePictureUrl ? profilePictureUrl : 'https://scontent-lga3-1.cdninstagram.com/vp/d5c47042a03d0d01f7da53c8e023a1eb/5DCD0694/t51.2885-19/s320x320/66113339_606527399754110_6647810716449374208_n.jpg?_nc_ht=scontent-lga3-1.cdninstagram.com';
    return (
        <View style={headerStyle} >
            <View style={headerLeftStyle}>
                <Image
                    style={profilePicStyle}
                    source={{ uri }}
                />
            </View>
            <View style={headerRightStyle}>
                <View style={usernameSectionStyle}>
                    <Text style={usernameTextStyle}>
                        { `${firstName} ${lastName}` }
                    </Text>
                </View>
                <View style={bioSectionStyle} >
                    <Text style={bioTextStyle}>
                        { bio }
                    </Text>
                </View>
                <TouchableOpacity onPress={toggleModal} style={{alignSelf: 'flex-start', borderColor: '#185CC6', borderRadius: 5, borderWidth: 0.5, backgroundColor: '#185CC6'}}>
                    <Text style={{fontSize: 14, color: '#f5f5f5', paddingTop: 5, paddingBottom: 5, paddingRight: 6, paddingLeft: 6}}>
                        Edit Profile
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default React.memo(AccountHeader);
