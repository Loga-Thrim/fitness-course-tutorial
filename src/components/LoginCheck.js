import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export default function LoginCheck() {
    const history = useHistory();
    const path = useLocation().pathname;

    useEffect(()=>{
        console.log(path);
        const token = localStorage.getItem("token");

        if(path !== "/login"){
            if(!token) history.push("/login")
            else{
                axios({
                    url: "http://localhost:5000/login-check",
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    data: JSON.stringify({token})
                }).then(res=>{
                    history.push("/");
                }).catch(e=>{
                    history.push("/login");
                    localStorage.removeItem("token");
                })
            }
        }
    }, [])
    return (
        <div>
        </div>
    )
}
