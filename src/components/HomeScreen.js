import { Rpn } from "./Rpn";

// needed whereever JSX is used
import React from "react";

import { View, StyleSheet } from "react-native";
import { Icon } from 'react-native-elements'

const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    menuBox: {
        position:'absolute',
        top:5,
        left:5,
        alignSelf:'flex-start'
    }
});

export const HomeScreen = Object.assign((props) => {
    const {navigate} = props.navigation;
    return <View style={style.mainContainer}>
        <Rpn/>
        <View style={style.menuBox}>
            <Icon
                name='menu'
                type='material'
                color='#517fa4'
                size={40}
                onPress={()=> navigate('Settings')}
            />
        </View>
    </View>;
}, {navigationOptions: { header: null}});
