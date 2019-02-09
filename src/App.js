import { Rpn } from "./components/Rpn";

// needed whereever JSX is used
import React from "react";

import {createStackNavigator, createAppContainer} from 'react-navigation';
import * as rpn from "@hamgom95/rpn";
import createContainer from "constate";

import {HomeScreen} from "./components/HomeScreen";
import {SettingsScreen} from "./components/SettingsScreen";
import { useSwitchList } from "./hooks/switchlist";

export const SettingsContainer = createContainer(() => useSwitchList(()=>Object.keys(rpn.ops), []));

const AppNavigator = createStackNavigator({
    Home: {screen: HomeScreen},
    Settings: {screen: SettingsScreen},
}, {
    initialRouteName: "Home",
});

const AppContainer = createAppContainer(AppNavigator);

const App = () => {
  // provide changeable settings
  return <SettingsContainer.Provider>
    <AppContainer/>
  </SettingsContainer.Provider>;
};

export default App;
