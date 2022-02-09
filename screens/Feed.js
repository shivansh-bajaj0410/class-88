import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import StoryCard from "./StoryCard";

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { FlatList } from "react-native-gesture-handler";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

let stories = require("./temp_stories.json");

export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      stories:[],
      light_theme:true
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }
  fetchStories=()=>{
    firebase.database().ref("/post/").on("value",(snapshot)=>{
      var stories = []
      if (snapshot.val()){
        Object.keys(snapshot.val()).forEach(function(key){
          stories.push({
            key:key,
            value:snapshot.val()[key]
          })
        })
      }
      this.setState({stories:stories})
    },function(errorObject){
      console.log("the read failed"+errorObject.code)
    })
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchStories();
  }

  renderItem = ({ item: story }) => {
    return <StoryCard story={story} navigation={this.props.navigation} />;
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text style = {this.state.light_theme?styles.appTitleTextLight:styles.appTitleText}>Storytelling App</Text>
            </View>
          </View>
          {!this.state.stories[0]?<View style = {styles.noStories}>
            <Text style={this.state.light_theme?styles.noStoriesTextLight:styles.noStoriesText}>No Stories Available</Text>
            </View>:
                      <View style={styles.cardContainer}>
            <FlatList
              keyExtractor={this.keyExtractor}
              data={stories}
              renderItem={this.renderItem}
            />
          </View>
          }
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row"
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center"
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  cardContainer: {
    flex: 0.85
  },
  noStories:{
    flex:0.85,
    justifyContent:"center",
    alignContent:"center"
  },
  noStoriesTextLight:{
    fontSize:RFValue(40),
fontFamily:"Bubblegum-Sans" 
 },
 noStoriesText:{
   color:"white",
fontSize:RFValue(40),
fontFamily:"Bubblegum-Sans"
}
});
