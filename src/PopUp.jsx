import { useNavigate } from "react-router-dom"
function PopUp({message,popStatus,navig=null}){
    const navigate=useNavigate()
    if (navig){
        navigate(navig);
    }
    return (
        <div className="popup">
            <div className="pop-inner">

            {message}
            <button className="pop-btn" onClick={()=>{
                popStatus("close");
                if (navig){
                navigate(navig);
                    }
                }}>OK</button>
            </div>
        </div>
    )
}
export default PopUp