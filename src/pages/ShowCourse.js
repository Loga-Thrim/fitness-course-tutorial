import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function ShowCourse() {
    const id = useParams().id;
    const [course, setCourse] = useState({
        _id: "",
        name: "",
        level: "",
        img: null
    });
    const [preview, setPreview] = useState(null);
    
    useEffect(()=>{
        axios({
            method: "GET",
            url: `http://localhost:5000/get-one-course/${id}`
        }).then(res=>{
            const { _id, name, level } = res.data.course;
            setCourse({_id, name, level});
            setPreview("/images/" + res.data.course.img)
        })
    }, [])

    function handleChoosepic(e){
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function (e) {
            setPreview([reader.result]);
        }
        setCourse({...course, img: file});
    }

    function submit(){
        const formData = new FormData();
        formData.append("id", course._id);
        formData.append("name", course.name);
        formData.append("level", course.level);
        formData.append("img", course.img);

        axios({
            method: "PUT",
            url: "http://localhost:5000/course",
            headers: {"Content-Type": "multipart/form-data"},
            data: formData,
        }).then(res=>{
            console.log(res.data);
        })
    }

    return (
        <div>
            <span>ชื่อคอร์ส:</span><input type="text" value={course.name}
            onChange={e=>setCourse({...course, name: e.target.value})} /> <br/><br/>
            <span>จำนวนเลเวล:</span> <input type="text" value={course.level}
            onChange={e=>setCourse({...course, level: e.target.value})} /><br/><br/>
            <img src={preview} width={200} alt="" /> <br /><br />
            <input type="file" onChange={handleChoosepic} /> <br /><br />
            <button type="button" onClick={submit}>แก่ไขข้อมูล</button>
        </div>
    )
}
