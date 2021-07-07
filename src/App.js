import './App.css';
import firebase from "firebase";
import 'firebase/auth';
import 'firebase/firestore';
import { useState, useEffect } from 'react';
import Channel from './components/Channel'


firebase.initializeApp({
  apiKey: "AIzaSyBET0Ptm6Ai9Fu3kbYjxt0yf3he6clry5k",
  authDomain: "nice-2249d.firebaseapp.com",
  projectId: "nice-2249d",
  storageBucket: "nice-2249d.appspot.com",
  messagingSenderId: "349017638661",
  appId: "1:349017638661:web:89b369a059a6055777d96c",
  measurementId: "G-RSHST1886E"
});

const db = firebase.firestore();

function App() {

  const [user, setUser] = useState(() => firebase.auth().currentUser);
  const [initializing, setInitializing] = useState(false);

  // const signInWithGoogle = async () => {
  //   const provider = new firebase.auth.GoogleAuthProvider();

  //   // firebase.auth().useDeviceLanguage();

  //   try {
  //     await firebase.auth.signInWithPopup(provider)
  //   }
  //   catch (error) {
  //     console.log(error);
  //   } 
  // }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if(user) {
        setUser(user);
      }
      else {
        setUser(null)
      }
    })
    return unsubscribe;
  }, []);


  const signInWithGoogle = async () => {
    // Retrieve Google provider object
    const provider = new firebase.auth.GoogleAuthProvider();
    // Set language to the default browser preference
    firebase.auth().useDeviceLanguage();
    // Start sign in process
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.log(error.message);
    }
  };

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    }
    catch (error) {
      console.log(error);
    }
  }

  if(initializing) {
    return "L O A D I N G . . .";
  }

  return (
    <div>
      {
        user ? (
          <div>
          <br />
          CHAT?
            <br />
            <Channel 
              user={user}
              db={db}
            />
            <button
            onClick={signOut}
            style={styles.button}
            >Sign Out</button>
          </div>
        ) : (
            <button
              onClick={signInWithGoogle}
              style={styles.signin}
            >Sign in with google</button>
        )
      }
    </div>
  );
}

export default App;


const styles = {
  button: {
    backgroundColor: 'red',
    height: '5%',
    width: '8%',
    position: 'absolute',
    bottom: '3%',
    right: '2%',
  },
  signin: {
    backgroundColor: 'green',
    height: '5%',
    width: '8%',
    position: 'absolute',
    top: '3%',
    left: '2%',
    color: 'white'
  },
}
