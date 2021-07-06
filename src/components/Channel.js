import React from 'react';
import { useState, useEffect } from 'react';
import firebase from 'firebase';

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
                <form onSubmit={handleOnSubmit}>
                    <input 
                        type="text"
                        value={newMessage}
                        onChange={handleOnChange}
                        placeholder="nice"
                    />
                </form>
                <button
                    onClick={handleOnSubmit}
                >Submit</button>
            </>
    );
};
 
export default Channel;