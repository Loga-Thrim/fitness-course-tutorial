import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { atom, useRecoilState } from 'recoil';

const dataLevelState = atom({
  key: "dataLevel",
  default: []
})

export default function ListCourse() {
  const history = useHistory();
  const [list, setList] = useState([]);
  const [dataLevel, setDataLevel] = useRecoilState(dataLevelState);

  useEffect(()=>{
    axios({
      method: "GET",
      url: "http://localhost:5000/get-course",
      headers: {"Content-Type": "application/json"}
    }).then(res=>{
      setList(res.data.courses);
    })
  }, [])

  function buy(name, level){
    setDataLevel([...dataLevel, {
      name, level
    }])
  }

  return (
    <div>
      {
        list.map((item, index)=>
          <div key={index}>
            <span>ชื่อคอร์ส: {item.name}</span> <br/>
            <span>จำนวนเลเวล: {item.level}</span> <br/>
            <img src={`/images/${item.img}`} style={{width: 50}} alt=""/> <br/>
            <button type="button" onClick={()=>history.push(`/list-one/${item._id}`)}>เลือกดู</button>
            <button type="button" onClick={()=>buy(item.name, item.level)}>ซื้อ</button>
            <button type="button" onClick={()=>setDataLevel(dataLevel.filter(e=>e.name!=item.name))}>ยกเลิก</button>
            <br/><br/>
          </div>
        )
      }
      <button onClick={()=>history.push("/check-bill")}>Check bill</button>
    </div>
  )
}
