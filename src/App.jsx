import {Routes, Route, Navigate} from "react-router-dom"
import SignUpPage from "./SignUpPage"
import SignInPage from "./SignInPage"
import { DelayedImport } from "./DelayedImport"
import {Suspense,lazy} from 'react'
import Loader from "./Loader"
function App(){
    const MyToDoMain=lazy(() => DelayedImport(() => import('./MyToDoMain')))
    // const FilterPage=lazy(()=> import("./FilterPage"))
    return (
        <>     
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace/>}></Route>
                <Route path="/login" element={<SignInPage/>}></Route>
                <Route path="/create-account" element={<SignUpPage/>}></Route>
                <Route path="/forgot-password" element={<div>Coming soon...</div>}></Route>
                <Route path="/mytasks" element={<Suspense fallback={<div style={{display:"flex", flexDirection:"column",alignItems:"center",justifyContent:"center",backgroundImage:"linear-gradient(to bottom,#1E152C, #0E1427)",height:"100vh"}}><Loader/>
        </div>}><MyToDoMain/></Suspense>}></Route>
                {/* <Route path="/filter-tasks" element={<Suspense fallback={<div style={{display:"flex", flexDirection:"column",alignItems:"center",justifyContent:"center"}}>Loading...</div>}><FilterPage/></Suspense>}></Route> */}
            </Routes>
        </>
    )
}
export default App
                        
