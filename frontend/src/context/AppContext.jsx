// import { createContext, useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import axios from 'axios'

// export const AppContext = createContext()

// const AppContextProvider = (props) => {

//     // Normalize backend URL - remove trailing slash if present
//     const rawBackendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
//     const backendUrl = rawBackendUrl.endsWith('/') ? rawBackendUrl.slice(0, -1) : rawBackendUrl

//     const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
//     const [userData, setUserData] = useState(null)
//     const [isAdmin, setIsAdmin] = useState(false)
//     const [isBackendWorking,setIsBackendWorking] = useState(true)

//     // Log backend URL for debugging
//     useEffect(() => {
//         console.log('Backend URL:', backendUrl)
//         if (!import.meta.env.VITE_BACKEND_URL) {
//             console.warn('VITE_BACKEND_URL is not set in environment variables. Using default: http://localhost:4000')
//         }
//     }, [backendUrl])


//     useEffect(()=>{
//         const checkBackendIsWorking = async()=>{
//             const {data} = await axios.get(`${backendUrl}`, { headers: { token } })
//             if(!data){
//                 setIsBackendWorking(false);
//             }
//         }
//     })

//     // Fetch user data when token changes
//     useEffect(() => {
//         const fetchUserData = async () => {
//             if (token && backendUrl) {
//                 try {
//                     const { data } = await axios.get(
//                         `${backendUrl}/api/user/profile`,
//                         { headers: { token } }
//                     )
//                     if (data.success && data.userData) {
//                         setUserData(data.userData)
//                         setIsAdmin(data.userData?.role === 'admin')
//                     } else {
//                         // Invalid token or user not found
//                         setUserData(null)
//                         setIsAdmin(false)
//                     }
//                 } catch (error) {
//                     console.error('Error fetching user data:', error)
//                     setUserData(null)
//                     setIsAdmin(false)
//                     // Clear invalid token on authentication errors
//                     if (error.response?.status === 401 || error.response?.status === 403) {
//                         localStorage.removeItem('token')
//                         // Use a callback to avoid dependency issue
//                         if (token) {
//                             setToken('')
//                         }
//                     }
//                 }
//             } else {
//                 setUserData(null)
//                 setIsAdmin(false)
//             }
//         }
//         fetchUserData()
//     }, [token, backendUrl])

//     const value = {
//         backendUrl,
//         token, setToken,
//         userData, setUserData,
//         isAdmin
//     }

//     return (
//         <AppContext.Provider value={value}>
//             {props.children}
//         </AppContext.Provider>
//     )

// }

// export default AppContextProvider



import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const rawBackendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const backendUrl = rawBackendUrl.endsWith('/') ? rawBackendUrl.slice(0, -1) : rawBackendUrl;

    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [userData, setUserData] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isBackendWorking, setIsBackendWorking] = useState(true);

    // 🔥 Check if backend is alive
    useEffect(() => {
        const checkBackendIsWorking = async () => {
            try {
              await axios.get(`${backendUrl}/`);  
              setIsBackendWorking(true);
            } catch (error) {
              setIsBackendWorking(false);
              console.error("Backend is DOWN");
            }
          };
          

        checkBackendIsWorking();
    }, [backendUrl]);

    // 🔥 Fetch user when token changes
    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) {
                setUserData(null);
                setIsAdmin(false);
                return;
            }

            try {
                const { data } = await axios.get(
                    `${backendUrl}/api/user/profile`,
                    { headers: { token } }
                );

                if (data.success) {
                    setUserData(data.userData);
                    setIsAdmin(data.userData.role === 'admin');
                }
            } catch (error) {
                console.log("Could not fetch profile");
                setUserData(null);
                setIsAdmin(false);
                localStorage.removeItem("token");
                setToken("");
            }
        };

        fetchUserData();
    }, [token, backendUrl]);

    const value = {
        backendUrl,
        token, setToken,
        userData, setUserData,
        isAdmin,
        isBackendWorking,     // ✅ VERY IMPORTANT
        setIsBackendWorking,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
