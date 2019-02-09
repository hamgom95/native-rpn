// @flow

import React from "react";
import { Alert, StyleSheet, ScrollView, Text, View, TouchableHighlight } from 'react-native';

import { toMatrix } from "../helper/matrix";

import {SettingsContainer} from "../App";
import * as rpn from "@hamgom95/rpn";

const style = StyleSheet.create({
    rootBlock: {
        flex: 1,
    },
    resBlock: {
        flex: 2,
        backgroundColor: "#193441",
    },
    resView: {
        flex: 1,
        padding: 10,
    },
    resScroll: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    resText: {
        fontSize: 44,
        color: '#d3d3d3',
    },
    res: {
        flex: 1,
        flexDirection: "row",
    },
    resTopText: {
        fontSize: 70,
        fontWeight: 'bold',
        color: 'white',
    },
    buttonBlock: {
        flex: 8,
        backgroundColor: '#3E606F',
        flexDirection: "row",
    },
    numBlock: {
        flex: 7,
    },
    numRow: {
        flex: 2,
        flexDirection: "row",
    },
    numButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#91AA9D'
    },
    numButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white'
    },
    opBlock: {
        flexGrow: 2,
        flexDirection: "column",
    },
    opButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#91AA9D',
        backgroundColor: '#273b3d',
    },
    opButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        fontSize: 26,
    }
});

const numOps: Array<number|string> = [
    "CE", "C", "¶",
    7,    8,    9,
    4,    5,    6,
    1,    2,    3,
    ",",  0,    "±",
];

// rpn calculator
export const Rpn = () => {
    const {used} = React.useContext(SettingsContainer.Context);
    const oldNum = React.useRef(null);
    const [num, setNum] = React.useState("");
    const [stack, setStack] = React.useState([]);

    const numOp = React.useCallback((val, long) => {
        if (typeof val === "number") {
            setNum(num => num + val.toString());
        } else if (val === ",") {
            // limit to one comma
            setNum(num => num.includes(".") ? num : num + ".");
        } else if (val === "¶") {
            // use oldNum if num empty
            const n = (num === "") ? oldNum.current : parseFloat(num);
            setNum("");
            if (!isNaN(n) && n !== null) {
                oldNum.current = n;
                setStack(stack => [...stack, n]);
            }
        } else if (val === "C") {
            if (num.length === 0) {
                // move top stack elem to num place
                const last = stack[stack.length-1];
                setStack(stack => stack.slice(0, stack.length-1));
                if (last !== undefined) setNum(last.toString());
            } else {
                // remove last char
                setNum(num => num.substring(0, num.length - 1));
            }
        } else if (val === "±") {
            // toggle - prefix
            setNum(num => (num[0] === "-" ) ? num.substring(1, num.length) : `-${num}`);
        } else if (val === "CE") {
            if (long) {
                // clear all
                setStack([]);
                setNum("");
            }
            else if (num.length === 0) {
                // drop top stack val
                setStack(stack => stack.slice(0, stack.length-1));
            } else {
                // clear current num
                setNum("");
            }
        }
    }, [num]);

    const stackOp = React.useCallback((name) => {
        const n = parseFloat(num);

        setNum("");
        if (!isNaN(n) && n !== null) {
            setStack(stack => [...stack, n]);
        }

        setStack(stack => {
            try {
                return rpn.add(stack, name);
            } catch (err) {
                if (err instanceof rpn.StackArgError) {
                    Alert.alert(err.message);
                } else {
                    throw err;
                }
                return stack;
            }
        });
    }, [num]);

    // dynamicly group buttons in matrix
    const NumBlock = React.useCallback(() => (
        <View style={style.numBlock}>
            {toMatrix(numOps, 3).map((row, ridx) =>
                <View style={style.numRow} key={ridx}>
                    {row.map((col, cidx) =>
                        <TouchableHighlight key={cidx} style={style.numButton} underlayColor="#193441" onPress={() => numOp(col, false)} onLongPress={() => numOp(col, true)}>
                            <Text style={style.numButtonText}>{col.toString()}</Text>
                        </TouchableHighlight>
                    )}
                </View>
            )}
        </View>
    ), [numOp]);

    const OpBlock = React.useCallback(() => (
        <ScrollView contentContainerStyle={style.opBlock}>
            {used.map(name =>
                <TouchableHighlight key={name} style={style.opButton} underlayColor="#193441" onPress={() => stackOp(name)}>
                    <Text style={style.opButtonText}>{rpn.ops[name].symbol || name}</Text>
                </TouchableHighlight>
            )}
        </ScrollView>
    ), [used, stackOp]);

    const resScroll = React.useRef(null);
    const Res = React.useCallback(() => (
        <ScrollView contentContainerStyle={style.resScroll}
            horizontal={true}
            ref={resScroll}
            onContentSizeChange={()=>resScroll.current.scrollToEnd({animated: false})}>
                {stack.map((item, idx) =>
                    <View key={idx} style={style.resView}>
                        <Text style={style.resText}>
                            {item.toString()}
                        </Text>
                    </View>
                )}

                <View>
                    <Text style={style.resTopText}>{num.toString()}</Text>
                </View>
        </ScrollView>
    ), [stack, num]);

    return <View style={style.rootBlock}>
        <View style={style.resBlock}>
            <Res />
        </View>
        <View style={style.buttonBlock}>
            <NumBlock />
            <OpBlock />
        </View>
    </View>;
};
