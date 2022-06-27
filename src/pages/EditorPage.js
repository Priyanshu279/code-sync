import React, { useState,useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';
import Client from'../components/Client';
import Editor from'../components/Editor';
import { initSocket } from '../socket';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';


const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const {roomId} = useParams();
  const reactNavigator = useNavigate();

   // State for Connected Clients List
   const [clients, setClients] = useState([]);



  useEffect(() => {
    const init = async () => {
        socketRef.current = await initSocket();
        socketRef.current.on('connect_error', (err) => handleErrors(err));
        socketRef.current.on('connect_failed', (err) => handleErrors(err));

        //  Socket Error handling function
        function handleErrors(e){
          console.log('socket error', e);
          toast.error('Socket connection failed, try again later.');
          reactNavigator('/');
        }
        
        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          username: location.state?.username,
        });

        // Listening for joined event
        socketRef.current.on(
          ACTIONS.JOINED, 
          ({clients,username,socketId}) => {
             if(username !== location.state?.username){
                  toast.success(`${username} joined the room.`);
                  console.log(`${username} joined`);
             }
             setClients(clients);
             socketRef.current.emit(ACTIONS.SYNC_CODE,{
              code: codeRef.current,
              socketId,
            });
        }
      );


        //Listening for disconnected
        socketRef.current.on(
          ACTIONS.DISCONNECTED, 
          ({socketId, username}) => {
          toast.success(`${username} left the room.`);
          setClients((prev) => {
            return prev.filter(
              (client) => client.socketId !== socketId
             );
          });
        }
      );
    };
    init();

    return () => {
        socketRef.current.disconnect();
        socketRef.current.disconnect(ACTIONS.JOINED);
        socketRef.current.disconnect(ACTIONS.DISCONNECTED);
    };
  }, []);

  // function for copying roomId for copy roomId Btn
  
  async function copyRoomId(){
    try{
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID has been copied to your clipboard');
    } catch(err){
      toast.error('Could not copy the Room Id');
      console.error(err);
    }
  }
  
  // Function for leave room for Leave Btn

  function leaveRoom(){
    reactNavigator('/');
  }

  if(!location.state){
    return <Navigate to="/" />;
  }

  return (
  <div className='mainWrap'>

    {/* leftside connection/logo/Btns block */}
    <div className='aside'>

        <div className='asideInner'>

          {/* For logo */}
          <div className='logo'>
              <img 
                  className='logoImage'
                  src="/code-sync.png"
                  alt="logo"
               />   
          </div>

          {/*Connected Clients*/}
          <h3>Connected</h3>
          <div className='clientsList'>
              {clients.map((client) => (
              <Client 
                  key={client.socketId} 
                  username={client.username}
              /> 
              ))}
          </div>
        </div>

        {/* copy roomid and leave button */}
    <button className='btn copyBtn' onClick={copyRoomId}>Copy ROOM ID</button>   
    <button className='btn leaveBtn' onClick={leaveRoom}>
      Leave
    </button>   
    </div>



    {/* rightside codeEditor block */}

    <div className='editorWrap'>
        <Editor 
        socketRef={socketRef} 
        roomId={roomId} 
        onCodeChange={(code) => {
          codeRef.current = code;
          }}
          />
    </div>
  </div>
  );
};

export default EditorPage;

