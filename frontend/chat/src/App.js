import {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';
import {nanoid} from 'nanoid';
import './App.css';

const socket=io.connect("http://localhost:8000");
const userName=nanoid(4);

function App() {

  
  const [message,setMessage] =useState('');
  const [chat,setChat] =useState([]);
  let videoRef = useRef(null);

  const sendChat=(e)=>{
   e.preventDefault();
   socket.emit("chat",{message,user:userName})
   setMessage('')
  }
  
  useEffect(()=>{
    socket.on("chat",(payload)=>{
       setChat([...chat,payload])
    })
  })

  const audioVideoStream = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        let videoStream = videoRef.current;
        videoStream.srcObject = stream;
        socket.emit("send-stream", { stream });
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  useEffect(() => {
    audioVideoStream();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
      <h1>cht app</h1>
      {
        chat.map((payload,index)=>{
          return(
            <p key={index}><span>id:{payload.user} &nbsp;</span>{payload.message}</p>
          )
        })
      }
      <form onSubmit={sendChat} >
        <input type="text" name="chat" placeholder="send msg" value={message} onChange={(e)=>{
          setMessage(e.target.value)
        }}/>
        <button type='submit'>Send</button>
      </form>
      <video autoPlay={true} ref={videoRef} height={300} width={300}></video>
      </header>
    </div>
  );
}

export default App;
