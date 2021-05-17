import { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export default function IndexPage(){
  const history = useHistory();
  const [form, setForm] = useState({
    name: "",
    level: 0,
    img: {}
  })

  function submitForm(){
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("level", form.level);
    formData.append("img", form.img);

    axios({
      url: "http://localhost:5000/insert-course",
      method: "POST",
      headers: {"Content-Type": "application/json"},
      data: formData
    }).then(res=>{
      console.log(res);
    })
  }

  return(
    <div>
      <form>
        <input type="text" placeholder="ระบุชื่อคอร์ส .. " onChange={e=>setForm({...form, name: e.target.value})} /> <br/><br/>
        <input type="text" placeholder="จำนวนเลเวล .. " onChange={e=>setForm({...form, level: e.target.value})} /> <br/><br/>
        <input type="file" onChange={e=>setForm({...form, img: e.target.files[0]})} /> <br/><br/>
        <input type="button" onClick={submitForm} value=" + เพิ่มคอร์ส" /> <br/><br/>
        <input type="button" value="เลือกดูคอร์ส" onClick={()=>history.push("/list")} />
      </form>
    </div>
  )
}
