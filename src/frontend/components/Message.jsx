import React, { useState } from "react";

function Message(props) {
  const { message, onVoteMessage, onAddComment, onDeleteMessage } = props;
  const [newComment, setNewComment] = useState("");

  function handleNewComment(event) {
    setNewComment(event.target.value);
  }

  function handleAddComment() {
    onAddComment(message.id, newComment);
    setNewComment("");
  }

  return (
    <div>
      <div class="msg-text">{message.text}</div>
      <div id="vote-buttons">
        <button onClick={() => onVoteMessage(message.id, "upvote")}>↑</button>
        <span>{message.votes}</span>
        <button onClick={() => onVoteMessage(message.id, "downvote")}>↓</button>
      </div>
      <div id="delete">
        <button onClick={() => onDeleteMessage(message.id)}>Delete</button>
      </div>
      <div id="comment-box">
        <input type="text" placeholder="Add a comment here!" size="80"
        value={newComment} onChange={handleNewComment} />
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
    </div>
  );
}

export default Message;



// import React from 'react';
// import { Card, Button, ListGroup } from 'react-bootstrap';

// const Message = ({ message, handleUpvote, handleDownvote, handleComment }) => {
//   return (
//     <Card className="mb-3">
//       <Card.Body>
//         <Card.Title>{message.title}</Card.Title>
//         <Card.Subtitle className="mb-2 text-muted">
//           {message.author}
//         </Card.Subtitle>
//         <Card.Text>{message.content}</Card.Text>
//         <Card.Text>
//           <Button variant="primary" onClick={() => handleUpvote(message.id)}>
//             Upvote
//           </Button>
//           {message.upvotes}
//           <Button variant="secondary" onClick={() => handleDownvote(message.id)}>
//             Downvote
//           </Button>
//           {message.downvotes}
//         </Card.Text>
//       </Card.Body>
//       <ListGroup variant="flush">
//         {message.comments.map((comment, index) => (
//           <ListGroup.Item key={index}>{comment}</ListGroup.Item>
//         ))}
//       </ListGroup>
//       <Card.Body>
//         <form onSubmit={(e) => handleComment(message.id, e.target.comment.value)}>
//           <input type="text" name="comment" />
//           <button type="submit">Comment</button>
//         </form>
//       </Card.Body>
//     </Card>
//   );
// };

// export default Message;
