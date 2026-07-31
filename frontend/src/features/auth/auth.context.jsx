import { createContext,useState } from "react";


export const AuthContext = createContext()


export const AuthProvider = ({ children }) => { 

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)//is true on production but false while testing

    


    return (
        <AuthContext.Provider value={{user,setUser,loading,setLoading}} >
            {children}
        </AuthContext.Provider>
    )

    
}