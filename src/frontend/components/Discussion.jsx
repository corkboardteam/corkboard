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
            upvoted: false,
            downvoted: false,
            comments: [],
        },
        ];
        setMessages(newMessages);
        setNewMessage("");
    }

    //THIS IS BUGGY WHEN SWITCHED TO A DIFFERENT USER
    async function handleVoteMessage(id, voteType) {
        const newMessages = messages.map((message) => {
        if (message.id === id) {
            if (voteType === "upvote") {
                if (message.upvoted) {  //undoing upvoted state
                    message.upvoted = false;
                    return { ...message, votes: message.votes - 1};
                } else {    //adding an upvote
                    message.upvoted = true;
                    return { ...message, votes: message.votes + 1};
                }
            } else if (voteType === "downvote") {
                if (message.downvoted) {  //undoing downvoted state
                    message.downvoted = false;
                    return { ...message, votes: message.votes + 1};
                } else {    //adding a downvote
                    message.downvoted = true;
                    return { ...message, votes: message.votes - 1};
                }
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

    async function handleKeyPress(event) {
        if(event.key === 'Enter'){
          handleAddMessage();
        }
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
        Go back to <Link to="/Dashboard"> Dashboard</Link>
        </div>
        <h1>Discussion Board</h1>
        <div>
            <center><input type="text" id="floatingInput" placeholder="Start a new thread!" value={newMessage} onChange={handleNewMessage} onKeyDown={handleKeyPress}/></center>
        </div>
        
        <ul>
            {messages.map((message) => (
            <h2>
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
            </h2>
            ))}
        </ul>
        </div>
    );
}

export default Discussion;