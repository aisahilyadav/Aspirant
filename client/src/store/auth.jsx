import { useEffect } from "react";
import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{

const [token, setToken] = useState(localStorage.getItem("token"));
const [user, setUser] = useState("");

    const storeTokenInLS = (serverToken) => {
        setToken(serverToken);
        return localStorage.setItem("token", serverToken);
    };

    let isLoggedIn = !!token;
    console.log("isLoggedIn", isLoggedIn);
    

//tackeling the logout function
const LogoutUser = () => {
    setToken("");
    return localStorage.removeItem("token");
};

useEffect(() => {
    //jwt authentication - to get the currently loggedIn user data
    const userAuthentication = async() => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user`,{
                method:"GET",
                headers:{
                    Authorization: `Bearer ${token}`,
                },
            });

            if(response.ok){
                const data = await response.json()
                console.log("user data", data.userData);
                setUser(data.userData);
            }
        } catch (error) {
            console.error("error fetching user data", error);
        }
    };

    if(token) {
        userAuthentication();
    }
}, [token]);


return( <AuthContext.Provider value={{storeTokenInLS, isLoggedIn, LogoutUser, user, token}}>
    {children}
</AuthContext.Provider>
);
};


export const useAuth =() => {
    const authContextValue = useContext(AuthContext);
    if (!authContextValue) {
        throw new Error("useAuth used outside of the Provider");
        
    }
    return authContextValue;
};