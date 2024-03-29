import React, { useState, useEffect } from "react";
import { useNavigate} from 'react-router-dom';
import Message from "./Message.jsx";
import { UserAuth } from '../../backend/authContext';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogActions from "@mui/material/DialogActions";
import { Button } from '@mui/material';

const Discussion = () => {
    //const { groupID } = groupID;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const navigate = useNavigate();
    const { currentUser } = UserAuth();
    const [openDialog, setOpenDialog] = React.useState(true);

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

    function handleCloseDialog() {
        setOpenDialog(false);
    }

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
            //upvoted: {},
            //downvoted: {},
            comments: [],
            authorID: currentUser,
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
                return { ...message, votes: message.votes + 1}
            }else if(voteType === "downvote") {
                return { ...message, votes: message.votes - 1}
            }
            //if no user interaction yet (either upvoted or downvoted)
            /*if (!(currentUser.uid in message.upvoted) || !(currentUser.uid in message.downvoted)){
                message.upvoted[currentUser.uid] = false;
                message.downvoted[currentUser.uid] = false;
            }
            if (voteType === "upvote") {
                if (message.upvoted[currentUser.uid]) {  //undoing upvoted state
                    message.upvoted[currentUser.uid] = false;
                    return { ...message, votes: message.votes - 1};
                } else {    //adding an upvote
                    message.upvoted[currentUser.uid] = true;
                    return { ...message, votes: message.votes + 1};
                }
            } else if (voteType === "downvote") {
                if (message.downvoted[currentUser.uid]) {  //undoing downvoted state
                    message.downvoted[currentUser.uid] = false;
                    return { ...message, votes: message.votes + 1};
                } else {    //adding a downvote
                    message.downvoted[currentUser.uid] = true;
                    return { ...message, votes: message.votes - 1};
                }
            }*/
        }
        return message;
        });
        setMessages(newMessages);
    }

    async function handleAddComment(id, text, event) {
        const newMessages = messages.map((message) => {
        if (message.id === id) {
            //if(event.key === "Enter"){
            const newComments = [
            ...message.comments,
            { 
                id: message.comments.length, 
                text: text,
                authorID_com: currentUser,
            },
            ];
            return { ...message, comments: newComments };
            //}
        }
        return message;
        });
        setMessages(newMessages);
    }

    async function handleDeleteMessage(id) {
        if(currentUser.uid == (messages.map((message) => message.authorID.uid))[0]){
            const newMessages = messages.filter((message) => message.id !== id);
            setMessages(newMessages);
        }else{
            setOpenDialog(true)
            return (
            <body>
                <Dialog open={openDialog} onClose={handleCloseDialog} >
                    {
                    <div className="dialog-div">You do not have permissions to delete this thread because you are not this thread's author.</div>
                    }
                    <DialogActions>
                        <Button variant="outlined" onClick={handleCloseDialog}>Close</Button>
                    </DialogActions>
                </Dialog>
            </body>
            )
        }
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
            <h4>{comment.text}</h4>
        </div>
        );
    }
    

    return (
        <div>
        <h1>Discussion Board</h1>
        <div>
            <center><input type="text" id="floatingInput" placeholder="Start a new thread about anything: a grocery trip, or maybe an item in the fridge!" 
            value={newMessage} onChange={handleNewMessage} onKeyDown={handleKeyPress}/></center>
        </div>
        
        
        <ul>
            {messages.map((message) => (
            <h3>
            
                <li key={message.id}>
                    <div className="message">
                    <Message
                    message={message}
                    onVoteMessage={handleVoteMessage}
                    onAddComment={handleAddComment}
                    onDeleteMessage={handleDeleteMessage}
                    />
                    </div>
                    
                    <div className="comment-line" >
                    <ul>
                    {message.comments.map((comment) => (
                        <li key={comment.id}>
                        <Avatar 
                            alt="Author Profile" 
                            src={comment.authorID_com.photoURL} 
                            sx={{width:25, height:25}}
                        />
                        <Comment comment={comment}/>
                        </li>
                    ))}
                    </ul>
                    </div>
                </li>
            
            </h3>
            ))}
         </ul>
        </div>
    );
}

export default Discussion;