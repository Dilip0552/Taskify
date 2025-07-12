import {Routes, Route, Navigate} from "react-router-dom"
import SignUpPage from "./SignUpPage"
import SignInPage from "./SignInPage"
// import MyToDo from './MyToDo'
import {Suspense,lazy} from 'react'

function App(){
    const MyToDoMain=lazy(()=> import('./MyToDoMain'))
    // const FilterPage=lazy(()=> import("./FilterPage"))
    return (
        <>     
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace/>}></Route>
                <Route path="/login" element={<SignInPage/>}></Route>
                <Route path="/create-account" element={<SignUpPage/>}></Route>
                <Route path="/mytasks" element={<Suspense fallback={<div style={{display:"flex", flexDirection:"column",alignItems:"center",justifyContent:"center"}}>Loading...</div>}><MyToDoMain/></Suspense>}></Route>
                {/* <Route path="/filter-tasks" element={<Suspense fallback={<div style={{display:"flex", flexDirection:"column",alignItems:"center",justifyContent:"center"}}>Loading...</div>}><FilterPage/></Suspense>}></Route> */}
            </Routes>
        </>
    )
}
export default App