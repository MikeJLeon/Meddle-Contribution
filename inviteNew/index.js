'use strict'
import firebase from 'firebase';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import { SectionList, Share, Image, View, Text, TouchableOpacity} from 'react-native'
import { Header, Title, Button, Left, Body, Right } from 'native-base';
import styles from './style';
import { DangerZone, Contacts, Permissions, Linking, Platform, WebBrowser} from 'expo';
import _ from 'lodash';
import MenuIcon from '../menuicon';
let { Branch } = DangerZone;

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

class inviteNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSections:[],
      dataContacts:[]
    };
  }

  async componentDidMount() {
    this.createBranchUniversalObject();
    const { currentUser } = firebase.auth();
    console.log(currentUser.uid);
    const permission = await Permissions.askAsync(Permissions.CONTACTS);
    //Check permission status
    if (permission.status !== 'granted') {
      return;
    }else{
      //Grab user's contacts
      const data = await Contacts.getContactsAsync({
        fields: [
          Contacts.PHONE_NUMBERS,
          Contacts.IMAGE,
          Contacts.THUMBNAIL,
          Contacts.URI
        ]
      });

      const sections = [];
      
      //Run if user has at least 1 contact
      if (data.total > 0) {
        //Traverse through the object grabbing necessary information while also reorganizing
        //all data into letter sections (Based off of name), Undefined = 0
        //NTS: Deal with contacts whos number is = to 0
        for (let prop in data.data) {
          let name = (data.data[prop].name);
          let number = "number";
          //Check if phone number category exists
          if(data.data[prop].phoneNumbers !== undefined){
            //Check if the object contains information then grab number
            if(data.data[prop].phoneNumbers[0]){          
              number = (data.data[prop].phoneNumbers[0].number);
            }else{
              number = "0";
            }
          }else{
            number = "0";
          }
          
          let fL = name.charAt(0);
          let image;

          //Check if contact has a image set, if not then set default image
          if(data.data[prop].imageAvailable){
            image = data.data[prop].thumbnail.uri;
          }else{
            image = "https://s3.eu-west-2.amazonaws.com/soundwise/uploads/user-profile/default.png";
          }
          //Check if first letter exists in sections object, if not then create a new object with the first letter.
          if(!(fL in sections)){
            sections.push({name: name, image: image, letter: fL, number: number});
          }else{
            sections.push({name: name, image: image, letter: fL, number: number});
          }
        }
        sections = _.groupBy(sections, d => d.letter);
        sections = _.reduce(sections, (acc, next, index) => {
          acc.push({
            key:index,
            data:next
          })
          return acc
        }, [])
        this.setState({dataSections: sections})
        this.setState({dataContacts: data.data});
      }
    }
  } 
  async createBranchUniversalObject() {
    const singleProfile = {
        uid: this.props.profile.uid,
        gravatar: this.props.profile.gravatar,
        name: this.props.profile.fname,
      };
      console.log(singleProfile);
      this._branchUniversalObject = await Expo.DangerZone.Branch.createBranchUniversalObject(
        `uid_${this.props.profile.uid}`,
        {
          title: 'You have been invited to meddle!',
          contentImageUrl: 'https://meddle.firebaseapp.com/images/facebookshare.png',
          contentDescription: 'Meddle is a new, free dating app that allows your friends to find someone for you.',
          // This metadata can be used to easily navigate back to this screen
          // when implementing deep linking with `Branch.subscribe`.
          metadata: {
            screen: 'viewInvite',
            singleProfile: JSON.stringify(singleProfile),
          }
        }
      );
  }
  onShareLinkPress = async (item) => {
    console.log(this._branchUniversalObject);
    const shareOptions = {
      messageHeader: 'Can I meddle for you?',
      messageBody: 'I think you should join Meddle, a new dating app that lets your best friends find you a date! Because we know exactly the kind of person you should be going out with anyway, right?',
    };
    await this._branchUniversalObject.showShareSheet(shareOptions);
    let string = this.props.profile.uid;
    //WebBrowser.openBrowserAsync("sms:" + item + "?body=" + (shareOptions.messageBody) + " " + encodeURIComponent("http://meddle.co/#/invite/" + string.toString()));
  };

  inviteFriend = async (item) => {
    console.log(item);
    WebBrowser.openBrowserAsync("sms:" + item + "?body='HAHAHAHAHAHAHA'");

  };
  render() {
    const _renderItem = (item) => {
      return (
        <View style={styles.contacts}>
          <Image style={styles.image} source={{uri: item.item.image}}/>
          <Text style={styles.name}>{item.item.name}</Text>
          {//<TouchableOpacity onPress={() => this.inviteFriend(item.item.number)} style={styles.button}>
          }
          <TouchableOpacity onPress={() => this.onShareLinkPress(item.item.number)} style={styles.button}>
            <Text style={styles.buttontext}>Invite!</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const _renderSectionHeader = (headerItem) => {
      return <Text style={styles.sections}>{headerItem.section.key}</Text>;
    }
    return (
      <View style={styles.container}>        
        <Header style={{backgroundColor: '#324A5A'}}>
          <Left style={{flex: 1}}>
            <Button testID="menu" transparent onPress={() => this.props.open()}>
                <MenuIcon />
            </Button>
          </Left>
          <Body style={{flex: 1}}>
            <Title style={styles.titleText}>Friends</Title>
          </Body>
          <Right style={{flex: 1}}>
          </Right>
        </Header>
        <SectionList
          renderItem={_renderItem}
          renderSectionHeader={_renderSectionHeader}
          sections={this.state.dataSections}
          keyExtractor={(item) => item.name}
        />
      </View>
    );
  }
}




function bindActions(dispatch) {
  return {
    reset: key => dispatch(reset([{ key: 'login' }], key, 0)),
    popRoute: key => dispatch(popRoute(key))
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  profile: state.profile,
  pinfo: state.pinfo,
});

export default connect(mapStateToProps, bindActions)(inviteNew)


