// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import {MetaData, TopBanner, PostHeader} from './components/phreddit.js'
// import {PostPageView, PageNameSortingButtons} from './components/page views.js'
// import Model from '../src/models/model.js';
import React from "react";
import {WelcomePage} from './components/welcomePage.js'
// import axios from 'axios';



function App() {
  // const [model] = useState(new Model());
  // const [comments, setComments] = useState([]);
  // const [posts, setPosts] = useState([]);
  // const [communities, setCommunities] = useState([]);
  // const [linkFlairs, setLinkFlairs] = useState([]);
  // const fetchData = async () => {
  //   try{
  //     console.log("\n app fetch data \n");
  //     const [communitiesRes, postsRes, commentsRes, linkflairsRes] = await Promise.all([
  //       axios.get("http://localhost:8000/communities"),
  //       axios.get("http://localhost:8000/posts"),
  //       axios.get("http://localhost:8000/comments"),
  //       axios.get("http://localhost:8000/linkflairs")
  //     ]);
  //     setCommunities(communitiesRes.data);
  //     setPosts(postsRes.data);
  //     setComments(commentsRes.data);
  //     setLinkFlairs(linkflairsRes.data);
  //     console.log("\n communitiesRes om app: ", communitiesRes, "\n");
  //   }
  //   catch(error){
  //     console.error("Error fetching data", error);
  //   }
  // };
  // useEffect(() => {
  //   fetchData();
  // }, []);
  return (
    // <ModelStateContext.Provider value={{model}}>
      <div className="body">
        <MetaData />
        {WelcomePage()}
      </div>
    // </ModelStateContext.Provider>
  );
}

export default App;