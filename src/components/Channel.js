import React from 'react';
import { useState, useEffect } from 'react';
import firebase from 'firebase';
import { StyleSheet } from 'react';

const Channel = ({user = null, db = null}) => {

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if(db) {
            // watch messages collection for changes
            // db.collection('messages').orderBy('time').limit(50);
            const unsubscribe = db
            .collection('messages')
            .orderBy('time')
            .limit(100)
            .onSnapshot(querySnapshot => {
                // get all messages from db collection with IDs
                const data = querySnapshot.docs.map(doc => ({
                    ... doc.data(),
                    id: doc.id,
                }));
                // data.map(t => {
                //     console.log('here - ', t.text);
                // })
                setMessages(data);
            })
        return unsubscribe;   
        }
    }, [db]);

    const [newMessage, setNewMessage] = useState('');
    const { uid, displayName, photoURL } = user;

    const handleOnSubmit = e => {
        e.preventDefault();
        setNewMessage(e.target.vaue);
        console.log(newMessage)
        if(newMessage !== 'nice') {
            alert('not nice');
            setNewMessage('')
            return;
        }
        if(db) {
            db.collection('messages').add({
                text: newMessage,
                time: firebase.firestore.FieldValue.serverTimestamp(),
                uid,
                displayName,
                photoURL
            })
        }
        setNewMessage('')
    }


    const handleOnChange = e => {
        setNewMessage(e.target.value)
    }

    return (
            <>
                <ul>
                    {messages.map(message => (
                        <li key={message.id}>{message.text}</li>
                    ))}
                </ul>
                <form onSubmit={handleOnSubmit}
                    style={styles.form}
                >
                    <input 
                        style={styles.input}
                        type="text"
                        value={newMessage}
                        onChange={handleOnChange}
                        placeholder="nice"
                    />
                </form>
                <button
                    style={styles.button}
                    onClick={handleOnSubmit}
                >nice</button>
            </>
    );
};
 
export default Channel;


const styles = {
    button: {
        backgroundColor: 'green',
        height: '5%',
        width: '8%',
        position: 'absolute',
        bottom: '3%',
        right: '12%',
    },
    form: {
        position: 'absolute',
        bottom: '3%',
        left: '2%',
    },
    input: {
        width: '80%',
    }
}