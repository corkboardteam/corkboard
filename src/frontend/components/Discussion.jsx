import React, { useState } from "react";
import Message from "./Message.jsx";
//import Comment from "./Comment.jsx";

function Discussion() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  function handleNewMessage(event) {
    setNewMessage(event.target.value);
  }

  function handleAddMessage() {
    const newMessages = [
      ...messages,
      {
        id: messages.length,
        text: newMessage,
        votes: 0,
        comments: [],
      },
    ];
    setMessages(newMessages);
    setNewMessage("");
  }

  function handleVoteMessage(id, voteType) {
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

  function handleAddComment(id, text) {
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