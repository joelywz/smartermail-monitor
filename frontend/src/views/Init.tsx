import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useData from "../store";

export default function Init() {
    const data = useData();
    const navigate = useNavigate();
  
    useEffect(() => {  
      init();  
    }, [])
  
    async function init() {
      data.reset();
      console.log("init")
      if (await data.hasRegistered()) {
        navigate("/login", { replace: true })
      } else {
        navigate("/register", { replace: true })
      }
    }
  
    return (
        <div>

        </div>
    )
}