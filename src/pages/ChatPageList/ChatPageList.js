import axios from "axios";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import chatService from "../../services/chat.service";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap"
import socket from "../../components/Socket/Socket";
import '../ChatPageList/ChatPageList.css'

export default function ChatList() {

  const [chats, setChats] = useState([]);
  const { id } = useParams()

  const navigate = useNavigate()

  const getAllChats = () => {
    // Get the token from the localStorage
    const storedToken = localStorage.getItem("authToken");

    // Send the token through the request "Authorization" Headers

    chatService
      .getOne("chats", id)
      .then((response) => setChats(response.data))
      .catch((error) => console.log(error));
  };

  // We set this effect will run only once, after the initial render
  // by setting the empty dependency array - []
  useEffect(() => {
    getAllChats();
  }, []);

  useEffect(() => {
    socket.on('updateChat', users => {
        if (users.includes(id)) {
            getAllChats()
        }
    })
}, []);

  return (
    
    <div className="general-container">

      <h1 className="page-title">Chats List</h1>

      <div className="chat-list">
        {chats.map((chat) => {

          const otherUser = chat.user1._id === id ? chat.user2 : chat.user1
          return (

            <Card key={chat._id} className="chat-card" onClick={() => navigate(`/chats/${id}/${otherUser._id}`)}>
              <div className="chat-img-container"><img src={otherUser.profileImg} className="chat-img" /></div>
              <div className="chat-preview-content">

                <h2 className="chat-name">{otherUser.name}</h2>


                <div className="chat-message-preview">
                  {(chat.messages[chat.messages.length - 1]?.sender == id) && 
                  
                  <p className="message-preview-content">You: {chat.messages[chat.messages.length - 1]?.content}</p>
                  
                  }
                  
                  {(chat.messages[chat.messages.length - 1]?.sender == otherUser._id) &&
                  
                  <p className="message-preview-content">{otherUser.name}: {chat.messages[chat.messages.length - 1]?.content}</p>
                  
                  }
                  {((Math.floor((new Date().getTime() - new Date(chat.messages[chat.messages.length - 1]?.createdAt).getTime()) / (1000 * 3600 * 24))) > 0 && chat.messages.length > 0) && 
                  <p className="chat-message-time">{`${(Math.floor((new Date().getTime() - new Date(chat.messages[chat.messages.length - 1].createdAt).getTime()) / (1000 * 3600 * 24)))} days ago`}</p>}
                  
                  {!((Math.floor((new Date().getTime() - new Date(chat.messages[chat.messages.length - 1]?.createdAt).getTime()) / (1000 * 3600 * 24))) > 0) && chat.messages.length > 0 && 
                  <p className="chat-message-time">{`At ${new Date(chat.messages[chat.messages.length - 1]?.createdAt).getHours()}:${new Date(chat.messages[chat.messages.length - 1]?.createdAt).getMinutes()}`}</p>}
                  
                </div>

              </div>

            </Card>


          )
        } 
        )}

      </div>
    </div>
  );
}
  