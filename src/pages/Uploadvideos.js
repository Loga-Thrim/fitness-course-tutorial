import React from 'react';
import axios from 'axios';

export default function Uploadvideos() {
    const [videos, setVideos] = React.useState([]);
    function upload(e){
        e.preventDefault();
        const formData = new FormData();
        for(let i=0;i<videos.length;++i){
            formData.append("videos", videos[i]);

            if(i == videos.length - 1){
                axios({
                    method: "POST",
                    url: "http://localhost:5000/upload-videos",
                    headers: {"Content-Type": "multipary/form-data"},
                    data: formData
                }).then(res=>{
                    console.log(res.data);
                })
            }
        }
    }

    return (
        <div>
            <input type="file" multiple onChange={e=>setVideos(e.target.files)} /> <br /><br />
            <button onClick={upload}>Upload files</button>
        </div>
    )
}
