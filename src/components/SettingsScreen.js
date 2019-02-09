// needed whereever JSX is used
import React from "react";
import { StyleSheet, View, TouchableHighlight, Text, ScrollView } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import {SettingsContainer} from "../App";
import * as rpn from "@hamgom95/rpn";

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonText: {
        fontSize: 44,
    },
    button: {
        flex:1,
        borderWidth: 0.2,
        borderColor: "black",
        justifyContent: "center"
    },
    categoryTest: {
        fontSize: 50,
    }
});

export const SettingsScreen = Object.assign(({navigate}) => {
    const {used, unused, toUsed, toUnused, setUsed} = React.useContext(SettingsContainer.Context);
  
    const RItem = ({item, index, move, moveEnd, isActive}) => <TouchableHighlight key={index} style={style.button} onPress={() => toUnused(item)} onLongPress={move} onPressOut={moveEnd}>
      <Text style={style.buttonText}>{rpn.ops[item].symbol || item}</Text>
    </TouchableHighlight>;
  
    return <View style={style.container}>
        <Text style={style.categoryTest}>Used Operators</Text>
        <DraggableFlatList
            data={used}
            renderItem={RItem}
            keyExtractor={name => `draggable-item-${name}`}
            scrollPercent={5}
            onMoveEnd={({data, to, from, row}) => setUsed(used => {
              used.splice(from, 1);
              used.splice(to, 0, row);
              return used;
            })}
        />
        <Text style={style.categoryTest}>Unused Operators</Text>
        <ScrollView>
          {unused.map(item => <TouchableHighlight style={style.button} key={item} onPress={()=>toUsed(item)}>
            <Text style={style.buttonText}>{rpn.ops[item].symbol || item}</Text>
          </TouchableHighlight>)}
        </ScrollView>
    </View>;
}, {navigationOptions: {title: "Settings"}});
