import React, { useState, useEffect } from 'react';
import { atom, selector,useRecoilState } from 'recoil';
import axios from 'axios';

const dataLevelState = atom({
  key: "dataLevel",
  default: []
})

export default function CheckBill() {
    const [dataLevel, setDataLevel] = useRecoilState(dataLevelState);
    const [sum, setSum] = useState(0);

    useEffect(()=>{
      let p_sum = 0;
      dataLevel.forEach((item, index)=>{
        p_sum += parseInt(item.level);
        if(index == dataLevel.length-1) setSum(p_sum);
      })
    }, [])

    console.log(dataLevel);

    function toSave(){
      axios({
        method: "POST",
        url: "http://localhost:5000/savehistory",
        data: {
          dataLevel,
          total: sum
        }
      })
    }

    return (
        <div>
            {
              dataLevel.map((item, index)=>
                <div key={index}>
                  <span>{item.name}</span> <br/>
                  <span>{item.level}</span> <br/><br/>
                </div>
              )
            }
            <span>ผลรวม เลเวล: {sum}</span>  <br /><br />
            <button onClick={toSave}>ยินยัน</button>
        </div>
    )
}
