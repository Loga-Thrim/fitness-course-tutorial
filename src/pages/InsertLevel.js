import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Progress } from 'react-sweet-progress';
import "../../node_modules/react-sweet-progress/lib/style.css";

export default function InsertLevel() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [level, setLevel] = useState("");
    const [video, setVideo] = useState(null);

    const [loaded, setLoaded] = useState(-1);

    function submit(event){
        event.preventDefault();
        
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("level", level);
        formData.append("video", video);

        axios({
            method: "POST",
            url: "http://localhost:5000/insert-level",
            headers: {"Content-Type": "multipart/form-data"},
            data: formData,
            onUploadProgress: (e)=>{
                if(e.lengthComputable){
                    setLoaded(((e.loaded * 100 / e.total)+"").split(".")[0]);
                }
            }
        }).then(res=>{
            console.log(res.data);
        }).catch(e=>{
            console.log(e);
        })
    }

    return (
        <div>
            <form onSubmit={submit}>
                <select onChange={e=>setLevel(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select> <br />
                <input type="text" placeholder="name" onChange={e=>setName(e.target.value)} /> <br />
                <input type="text" placeholder="price" onChange={e=>setPrice(e.target.value)} /> <br />
                <input type="file" onChange={e=>setVideo(e.target.files[0])} /> <br />
                <button type="submit">Insert Level</button>
            </form>
            {
                loaded > -1 ? <Progress percent={loaded} /> : null
            }
        </div>
    )
}
