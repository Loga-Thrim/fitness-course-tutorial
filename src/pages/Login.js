import axios from 'axios';
import React, { useRef } from 'react';
import ReactPlayer from 'react-player'

export default function Login() {
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    function login(e){
        e.preventDefault();
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        axios({
            url: "http://localhost:5000/login",
            method: "POST",
            headers: {"Content-Type": "application/json"},
            data: JSON.stringify({
                username, password
            })
        }).then(res=>{
            if(!res.data.token) alert("Login failed");
            else {
                localStorage.setItem("token", res.data.token);
                alert("Login success");
            }
        })
    }

    return (
        <div>
            <form onSubmit={login}>
                <input type="text" ref={usernameRef} /> <br /><br />
                <input type="text" ref={passwordRef} /> <br /><br />
                <button type="submit">Login</button>
            </form> <br /><br /><br />
            
            <div style={{width: 800}}>
                <ReactPlayer 
                    url='https://youtu.be/Rq5SEhs9lws'
                    controls  // gives the front end video controls 
                    width='100%' 
                    height='100%'
                    config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                    onContextMenu={e => e.preventDefault()}
                 />
            </div>
        </div>
    )
}
