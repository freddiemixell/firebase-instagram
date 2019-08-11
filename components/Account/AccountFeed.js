import React from 'react';
import { Image, TouchableOpacity, FlatList, Dimensions, View, Text, StyleSheet } from 'react-native';

const style = StyleSheet.create({
  noPostStyle: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noPostText: { fontSize: 18 },
});

const numColumns = 3;

let placeholder = Array.apply(null, Array(60)).map((v, i) => {
  return { id: i, src: 'http://placehold.it/200x200?text='+(i+1),  }
});

function AccountFeed(props) {
    const { posts } = props;
    return posts.length > 0
      ? (
            <FlatList
              data={posts}
              renderItem={renderPic}
              numColumns={numColumns}
              keyExtractor={item => `${item.image}`}
            />
      )
      : (
        <View style={style.noPostStyle}>
          <Text style={style.noPostText}>
            No posts yeet!
          </Text>
        </View>
      );
}

function renderPic({ item }) {
    const { width } = Dimensions.get('window');
    const itemSize = Math.floor( width / numColumns );

    return(
      <TouchableOpacity
        style = {{ width: itemSize, height: itemSize, paddingTop: 1, marginLeft: 0.5, marginRight: 0.5 }}
        onPress = { () => {
          // Do Something
        }}>
        <Image
          resizeMode = "cover"
          style = {{ flex: 1 }}
          source = {{ uri: item.image }}
        />
      </TouchableOpacity>
    );
}


export default React.memo( AccountFeed );