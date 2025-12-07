// import React, { useContext } from "react";
// import { AppContext } from "../context/AppContext";
// import Banner from "../components/Banner";
// import ErrorBanner from "../components/ErrorBanner";

// const Home = () => {
//   const { isBackendWorking } = useContext(AppContext);

//   return (
//     <div className="min-h-screen py-8">
//       {isBackendWorking ? <Banner /> : <ErrorBanner />}
//     </div>
//   );
// };

// export default Home;



import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Banner from "../components/Banner";
import ErrorBanner from "../components/ErrorBanner";

const Home = () => {
  const { isBackendWorking } = useContext(AppContext);

  return (
    <div className="min-h-screen py-8">
      {isBackendWorking ? <Banner /> : <ErrorBanner />}
    </div>
  );
};

export default Home;
