export default function LeftMenu({ login, logout,updateState }){
    const handleStateUpdate = () => {
      updateState(1);
      const questionElement = document.getElementById('question_menu');
      const tagElement = document.getElementById('tag_menu');
      const userP = document.getElementById('user_profile');
      questionElement.style.backgroundColor = 'lightgray'; 
      tagElement.style.backgroundColor = 'white';
      if(login){
        userP.style.backgroundColor = 'white';
       }
       
    }
    const handleStateUpdate2 = () => {
       const questionElement = document.getElementById('question_menu');
       const tagElement = document.getElementById('tag_menu');
       const userP = document.getElementById('user_profile');
       questionElement.style.backgroundColor = 'white'; 
       tagElement.style.backgroundColor = 'lightgray';
       if(login){
        userP.style.backgroundColor = 'white';
       }
       

      updateState(3);
    }
    const handleStateUpdate3 = () => {
      const questionElement = document.getElementById('question_menu');
      const tagElement = document.getElementById('tag_menu');
      const userP = document.getElementById('user_profile');
      questionElement.style.backgroundColor = 'white'; 
      tagElement.style.backgroundColor = 'white';
      userP.style.backgroundColor = 'lightgray';
     updateState(10);
   }
    const handleLogout = async() => {
      await logout();
    }
      return(
        <div className = "left"> 
          
          <button id = "question_menu" onClick={handleStateUpdate}
          style ={{backgroundColor:''}}>Questions</button>
          <button id = "tag_menu"onClick={handleStateUpdate2}
          style ={{backgroundColor:'white'}}>Tags</button>
            {login && 
          <button id = "user_profile"onClick={handleStateUpdate3}
          style ={{backgroundColor:'white'}}>Profile</button>
          }
          {login && 
          <button  onClick={logout}>Log out</button>}
        </div>
      );
    }