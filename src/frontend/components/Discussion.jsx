import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import Message from "./Message.jsx";
import { UserAuth } from '../../backend/authContext';

const Discussion = () => {
    //const { groupID } = groupID;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const navigate = useNavigate();
    const { currentUser } = UserAuth();

    useEffect(() => {
        if (currentUser.groupID == null) {
            navigate('/Group');
          }
          console.log(currentUser);
        const storedMessages = localStorage.getItem(`discussions_${currentUser.groupID}`);
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        }
    }, [currentUser, navigate]);
    
    useEffect(() => {
    localStorage.setItem(`discussions_${currentUser.groupID}`, JSON.stringify(messages));
    }, [currentUser, messages]);

    async function handleNewMessage(event) {
        setNewMessage(event.target.value);
    }

    async function handleAddMessage() {
        const newMessages = [
        ...messages,
        {
            id: Math.random().toString(36),
            text: newMessage,
            votes: 0,
            comments: [],
        },
        ];
        setMessages(newMessages);
        setNewMessage("");
    }

    async function handleVoteMessage(id, voteType) {
        const newMessages = messages.map((message) => {
        if (message.id === id) {
            if (voteType === "upvote") {
            return { ...message, votes: message.votes + 1 };
            } else if (voteType === "downvote") {
            return { ...message, votes: message.votes - 1 };
            }
        }
        return message;
        });
        setMessages(newMessages);
    }

    async function handleAddComment(id, text) {
        const newMessages = messages.map((message) => {
        if (message.id === id) {
            const newComments = [
            ...message.comments,
            { id: message.comments.length, text: text },
            ];
            return { ...message, comments: newComments };
        }
        return message;
        });
        setMessages(newMessages);
    }

    async function handleDeleteMessage(id) {
        const newMessages = messages.filter((message) => message.id !== id);
        setMessages(newMessages);
    }

    function Comment(props) {
        const { comment } = props;

        return (
        <div>
            <div>{comment.text}</div>
        </div>
        );
    }
    

    return (
        <div>
        <div className="w-100 text-center mt-2">
        Go back to <Link to="/"> Dashboard</Link>
        </div>
        <h1>Discussion</h1>
        <div>
            <input type="text" value={newMessage} onChange={handleNewMessage} />
            <button onClick={handleAddMessage}>Add Message</button>
        </div>
        <ul>
            {messages.map((message) => (
            <li key={message.id}>
                <Message
                message={message}
                onVoteMessage={handleVoteMessage}
                onAddComment={handleAddComment}
                onDeleteMessage={handleDeleteMessage}
                />
                <ul>
                {message.comments.map((comment) => (
                    <li key={comment.id}>
                    <Comment comment={comment} />
                    </li>
                ))}
                </ul>
            </li>
            ))}
        </ul>
        </div>
    );
}

export default Discussion;