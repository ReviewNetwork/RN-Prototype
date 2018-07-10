import React from 'react';
import { SafeAreaView, TextInput, Image, ImageBackground, Text, StatusBar, View, StyleSheet, TouchableOpacity, Dimensions, AsyncStorage, Platform } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/dist/Entypo';
import EIcon from 'react-native-vector-icons/dist/EvilIcons';
import CryptoJS from 'crypto-js';
import JSON from 'circular-json';
import web3 from '../services/web3';
import wallet from '../services/wallet';
import isEmail from '../utils/isEmail';

const styles = StyleSheet.create({
  button: {
    marginTop: 15,
    marginBottom: 5,
    marginLeft: 15,
    marginRight: 15,
    padding: 12,
    borderRadius: 40,
    width: Dimensions.get('window').width * 0.8,
  },

  buttonText: {
    fontSize: 20,
    textAlign: 'center',
  },

  inputWrapper: {
    marginRight: 20,
    marginLeft: 20,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 2,
    paddingBottom: 2,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#A456C2',
  },


  input: {
    height: 44,
    fontSize: 20,
    color: '#A456C2',
  },

  logo: {
    height: 115,
    width: 150,
    marginBottom: Platform.OS === 'android' ? 80 : 160,
  },
});


class Authentication extends React.Component {
  state = {
    isModalOpened: false,
    authType: '',
    email: '',
    password: '',
    inputFocused: false,
  }

  async componentDidMount() {
    const savedAccount = JSON.parse(await AsyncStorage.getItem('savedAccount'));
    if (savedAccount) {
      this.setAccount(savedAccount);
      this.props.navigation.navigate('App');
    }
  }

  componentWillUnmount() {
    this.closeModal();
  }

  setAccount(account) {
    wallet.setPrivateKey(account.privateKey);
    web3.eth.defaultAccount = account.address;
    web3.eth.coinbase = account.address;
  }

  storeAccount(account) {
    AsyncStorage.setItem('savedAccount', JSON.stringify(account));
  }

  openModal = (type = '') => {
    this.setState({ isModalOpened: true, authType: type });
  }

  closeModal = () => {
    this.setState({ isModalOpened: false, authType: '', inputFocused: false });
  }

  handleRegister = async () => {

    // add email and password validation....
    if (!isEmail(this.state.email)) {
      alert('Email is not valid!');
      return false;
    }

    if (this.state.password.length < 5) {
      alert('The password is too short!');
      return false;
    }

    // check if the user is already registered:
    const registered = (JSON.parse(await AsyncStorage.getItem(this.state.email)));

    if (registered) {
      alert('This email is taken!');
      return false;
    }


    // create new wallet with 1 account:
    let newWallet;
    try {
      newWallet = web3.eth.accounts.wallet.create(1);
    } catch (err) {
      alert('Wallet creation failed!');
      return false;
    }

    const account = newWallet[0];

    // get some ether from our faucet:
    fetch(`https://nano-faucet-abxdvnznse.now.sh/request/${account.address}`).then(res => {
      alert('Your account is now ready for use!');
    });

    // set the default account:
    this.setAccount(account);

    // store account in localstorage to be accessible on the app start
    this.storeAccount(account);

    // encrypt wallet with password, and store it in AsyncStorage to be connected with the email
    // const encryptedWallet = web3.eth.accounts.wallet.encrypt(this.state.password);
    const encryptedWallet = CryptoJS.AES.encrypt(JSON.stringify(newWallet), this.state.password);

    AsyncStorage.setItem(this.state.email, JSON.stringify(encryptedWallet));

    this.closeModal();
    this.props.navigation.navigate('App');
  }

  handleLogin = async () => {
    // add email and password validation....
    if (!isEmail(this.state.email)) {
      alert('Email is not valid!');
      return false;
    }

    if (this.state.password.length < 5) {
      alert('The password is too short!');
      return false;
    }

    // decrypt wallet from AsyncStorage with given password (find it in AsyncStorage with email)
    const encryptedWallet = JSON.parse(await AsyncStorage.getItem(this.state.email));

    // const decryptedWallet = web3.eth.accounts.wallet.decrypt(encryptedWallet, this.state.password); // slow on devices
    let decryptedWallet;
    try {
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedWallet, this.state.password);
      decryptedWallet = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
    } catch (err) {
      alert('Invalid Credentials!');
      return false;
    }

    const account = decryptedWallet[0];

    // set the default account:
    this.setAccount(account);

    // store account in localstorage to be accessible on the app start
    this.storeAccount(account);

    this.props.navigation.navigate('App');
    this.closeModal();
  }

  render() {
    return (
      <ImageBackground
        style={{
          backgroundColor: '#ccc',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        source={require('../assets/img/auth_background.jpg')}
      >
        <StatusBar barStyle="light-content" translucent backgroundColor="rgba(255, 255, 255, 0)" />
        <Modal avoidKeyboard isVisible={this.state.isModalOpened}>
          <SafeAreaView style={{ backgroundColor: 'white', flex: Platform.OS === 'android' ? 1 : 0.8, borderRadius: 10, justifyContent: 'flex-start' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 20 }}>
              <TouchableOpacity onPress={() => this.closeModal()}>
                <EIcon name="close" size={36} color="#A456C2" />
              </TouchableOpacity>
            </View>

            <View style={{ justifyContent: 'flex-end', flex: 0.9, alignItems: 'center' }}>
              {!this.state.inputFocused && <Image
                style={styles.logo}
                source={require('../assets/logo.png')}
              />}
              <View style={styles.inputWrapper}>
                <Icon name="email" size={20} color="#A456C2" />
                <View style={{flex: 1, marginLeft: 10}}>
                  <TextInput
                    blurOnSubmit
                    onChangeText={(email) => this.setState({ email })}
                    autoCorrect={false}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    placeholder="Email"
                    placeholderTextColor="#A456C2"
                    autoCapitalize="none"
                    style={styles.input}
                    onFocus={() => this.setState({ inputFocused: true })}
                    onBlur={() => this.setState({ inputFocused: false })}
                  />
                </View>
              </View>
              <View style={[styles.inputWrapper, { marginTop: 20 }]}>
                <Icon name="key" size={20} color="#A456C2" />
                <View style={{flex: 1, marginLeft: 10}}>
                  <TextInput
                    blurOnSubmit
                    onChangeText={(password) => this.setState({ password })}
                    autoCorrect={false}
                    secureTextEntry
                    underlineColorAndroid="rgba(0,0,0,0)"
                    placeholder="Password"
                    placeholderTextColor="#A456C2"
                    autoCapitalize="none"
                    style={styles.input}
                    onFocus={() => this.setState({ inputFocused: true })}
                    onBlur={() => this.setState({ inputFocused: false })}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#7A56B8' }]}
                onPress={() => this[`handle${this.state.authType}`]()}
              >
                <Text style={[styles.buttonText, { color: 'white' }]}>{this.state.authType || 'Submit'}</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
        <SafeAreaView style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            source={require('../assets/logo.png')}
            style={{
              height: 140,
              width: 180,
            }}
          />
          <Text style={{
            fontSize: 34,
            color: 'white',
            textAlign: 'center',
          }}>
            Review.Network
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#7A56B8', marginTop: 100 }]}
            onPress={() => this.openModal('Login')}
          >
            <Text style={[styles.buttonText, { color: 'white' }]}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'white' }]}
            onPress={() => this.openModal('Register')}
          >
            <Text style={[styles.buttonText, { color: 'black' }]}>Register</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

export default Authentication;
