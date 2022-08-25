import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../hooks/useAlert";
import useData from "../store";

export default function Init() {
    const data = useData();
    const navigate = useNavigate();
    const alert = useAlert();
  
    useEffect(() => {  
      init();  
    }, [])
  
    async function init() {
      data.reset();
      console.log("init")

      try {
        if (await data.hasRegistered()) {
          navigate("/login", { replace: true })
        } else {
          navigate("/register", { replace: true })
        }
      } catch (e) {
          alert.pushAlert("Error", (e as Error).message);
      }

    }
  
    return (
        <div>

        </div>
    )
}