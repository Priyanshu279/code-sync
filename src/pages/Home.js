import React, { useState } from 'react'
import {v4 as uuidV4} from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  
  const navigate = useNavigate();//Function/Hook For redirecting to editor page
  const [roomId, setRoomId] = useState('');//Binding roomid in state
  const [username, setUsername] = useState('');//Binding username in state

  //New Room Id Generate Function &Toast Notification

  const createNewRoom = (e) => {
    e.preventDefault(); //stops page refresh while clicking on newroom button
    const id = uuidV4();//Unique Id generate
    setRoomId(id);//set id in state
    toast.success('Created a new room');//Shows notification whenever new room is created
  };

  // function for joinBtn joining room
  const joinRoom = () =>{
    if(!roomId || !username){
      toast.error('ROOM ID & Username is required');
      return;
    }

    //Redirect to Editor Page using useNavigate hook
    navigate(`/editor/${roomId}`,{
      state:{
        username,
      },
    });
  };

  //Function for on Pressing Enter Join the room
  const handleInputEnter = (e) =>{
    if(e.code === 'Enter'){
      joinRoom();
    }
  };

  return ( 
      <div className='homePageWrapper'>
        <div className='fromWrapper'>
          <img 
              className='homePageLogo'
              src='code-sync.png'
              alt='code-sync-logo'
          />
          <h4 className='mainLabel'>Paste invitation ROOM ID</h4>
          <div className='inputGroup'>
            <input 
                type="text" 
                className='inputBox' 
                placeholder='ROOM ID'
                onChange={(e) => setRoomId(e.target.value)}//EventListner, setting unique roomid dynamically and manually 
                value={roomId}//setting unique roomid in input username
                onKeyUp={handleInputEnter}//EventListner, on pressing EnterKey join the room
                />
            <input 
                type="text" 
                className='inputBox' 
                placeholder='USERNAME'
                onChange={(e) => setUsername(e.target.value)}//EventListner, setting username manually
                value={username}//setting username in input
                onKeyUp={handleInputEnter}//EventListner, on pressing EnterKey join the room
                
            />

            <button 
            className='btn joinBtn'
            onClick={joinRoom}//function call for joining room on clicking join button
            >
              Join
            </button>

            <span className='createInfo'> 
               If you don't have an invite then create &nbsp;
                 <a 
                    onClick={createNewRoom} //create new unique room id
                    href='' 
                    className='createNewBtn'
                 >
                    new room
                 </a>
            </span>
          </div>
        </div>
        <footer>
            <h4>
              Built with 💚 by&nbsp;
              <a href='https://github.com/priyanshu279'>Priyanshu</a>
            </h4>
        </footer>
    </div>
  ); 
};

export default Home;
