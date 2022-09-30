import React, { useState } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function App() {
  // React States
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [user, setUser] = useState('');
  const [responseQuery, setResponseQuery] = useState('')

  //const ip = "145.94.223.136"
  const ip = "localhost"

  // User Login info
  const database = [
    {
      username: "buyer",
      password: "buyer"
    },
    {
      username: "seller",
      password: "seller"
    },
    {
      username: "bank",
      password: "bank"
    }
  ];

  const errors = {
    uname: "invalid username",
    pass: "invalid password"
  };

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass } = document.forms[0];

    // Find user login info
    const userData = database.find((user) => user.username === uname.value);

    // Compare user info
    if (userData) {
      if (userData.password !== pass.value) {
        // Invalid password
        setErrorMessages({ name: "pass", message: errors.pass });
      } else {
        setIsSubmitted(true);
        setUser(userData);
      }
    } else {
      // Username not found
      setErrorMessages({ name: "uname", message: errors.uname });
    }
  };

  const handleConfirmation = (event) => {
    event.preventDefault(); 

    var {amount, price , docNumber } = document.forms[0];

    // add the hooks 
    const datas = {
      amount : amount.value, 
      price : price.value,
      docNumber : docNumber.value,
    }

    console.log(datas)

    const reponse = fetch("http://" + ip + ":8080/approve", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ data : datas  }),
    })    
    .then(res => res.json())
    .then(
      (result) => {
        console.log(result)
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        console.log("There is a problem approving" + error)
      })

      return reponse
  }

  
  const handleIssue = (event) => {
    event.preventDefault(); 

    var {amount, price , docNumber } = document.forms[0];

    // add the hooks 
    const datas = {
      amount : amount.value, 
      price : price.value,
      docNumber : docNumber.value,
    }

    const reponse = fetch("http://" + ip + ":8080/request", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ data : datas  }),
    })    
    .then(res => res.json())
    .then(
      (result) => {
        console.log(result)
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        console.log("There is a problem issueing a request")
      })

      return reponse
  }

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // JSX code for login form
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" required />
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" required />
          {renderErrorMessage("pass")}
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
  );

  const SellerDashboard = () => {
    return (
      <div>
        <div className="header">
          <img className="headerImage" alt = '' src = 'https://i.imgur.com/3Wgylws.png' ></img>
          <img className="headerImage" alt = '' src = 'https://media.indebuurt.nl/delft/2018/10/25104411/TU-Delft-logo-680x380.png'></img>
          <h1 className="inline">JIP Smart industry</h1>
        </div> 
  
        <div className="wrapper">
  
        <div className="first">
        <img className = 'profilePic' alt = '' src ='https://i.imgur.com/6lsQkmD.png'></img>
          <h1>Welcome seller</h1> 
        </div>
  
        <div className="second consoleWrapper">
          <div className="actionHeader">
          <h1>Choose your action</h1>
          </div>
          <div className="wrapper"> 
          
          <div className="second padding">
            <button className = 'queryButton' onClick = {handleQuery}>Query</button>
            <div className = "console">
              <pre>{JSON.stringify(responseQuery).replace(/\\/g, "").replace(/,/g, "\n")}</pre>
            </div>
          </div>
  
          <div className="first">
            <h1>Approve payment confirmation</h1>
  
  
      <div className="form">
        <form onSubmit={handleConfirmation}>
          <div className="input-container">
            <label>Bannanas in KG</label>
            <input type="text" name="amount" required />
            {renderErrorMessage("pass")}
          </div>
          <div className="input-container">
            <label>Price</label>
            <input type="text" name="price" required />
            {renderErrorMessage("pass")}
          </div>
          <div className="input-container">
            <label>Request number</label>
            <input type="text" name="docNumber" required />
            {renderErrorMessage("pass")}
          </div>
          <div className="button-container">
            <input type="submit" />
          </div>
        </form>
      </div>
          </div>
  
          </div>
          
        </div>
  
        </div>
        
      </div>)
  }


  const handleQuery = () => {
    const response = fetch("http://" + ip + ":8080/query")
    .then(res => res.json())
    .then(
      (result) => {
        setResponseQuery(result)
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        console.log("There is a problem reaching the server")
      })

    return response
  }

  const BuyerDashboard = () => {
    return (
    <div>
      <div className="header">
        <img className="headerImage" alt = '' src = 'https://i.imgur.com/3Wgylws.png' ></img>
        <img className="headerImage" alt = '' src = 'https://media.indebuurt.nl/delft/2018/10/25104411/TU-Delft-logo-680x380.png'></img>
        <h1 className="inline">JIP Smart industry</h1>
      </div> 

      <div className="wrapper">

      <div className="first">
      <img className = 'profilePic' alt = '' src ='https://i.imgur.com/6lsQkmD.png'></img>
        <h1>Welcome buyer</h1>
        
      </div>

      <div className="second consoleWrapper">
        <div className="actionHeader">
        <h1>Choose your action</h1>
        </div>
        <div className="wrapper"> 
        
        <div className="second padding">
          <button className = 'queryButton' onClick = {handleQuery}>Query</button>
          <div className = "console">
            <pre>{JSON.stringify(responseQuery).replace(/\\/g, "").replace(/,/g, "\n")}</pre>
          </div>
        </div>

        <div className="first">
          <h1>Request payment confirmation</h1>


    <div className="form">
      <form onSubmit={handleIssue}>
        <div className="input-container">
          <label>Bannanas in KG</label>
          <input type="text" name="amount" required />
          {renderErrorMessage("pass")}
        </div>
        <div className="input-container">
          <label>Price</label>
          <input type="text" name="price" required />
          {renderErrorMessage("pass")}
        </div>
        <div className="input-container">
          <label>Request number</label>
          <input type="text" name="docNumber" required />
          {renderErrorMessage("pass")}
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>


        </div>

        </div>
        
      </div>

      </div>
      
    </div>)
  }

  const turnIntoLoc = (docNumber) => {


   const datas = {
      docNumber : docNumber , 
    }

    // call the fetch function which tries to "redeem" the last approved
    const reponse = fetch("http://" + ip + ":8080/LoC", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ data : datas  }),
    })    
    .then(res => res.json())
    .then(
      (result) => {
        console.log(result)
      },
      (error) => {
        console.log("There is a problem issueing a LoC")
      })
      return
  }

  const bussinessLogic = () =>{

    const approves_requests_seller = JSON.parse(responseQuery.approves_requests_seller); 

    if (approves_requests_seller){
      const lengthArray = approves_requests_seller.length
      for(var i = 0 ; i < lengthArray; i ++ ){

        // enter the bussiness logic for the bank
        const amount = parseInt(approves_requests_seller[i].Record.amount);
        const price = parseInt(approves_requests_seller[i].Record.price);
        const docNumber = parseInt(approves_requests_seller[i].Record.paperNumber);

        if(amount > 100 && amount/price < 10){
          console.log("Turning into an LoC")
          turnIntoLoc(docNumber)
        }else{
          return
        }
        
      }
    }

      return
  }

  const BankDashboard = () => {

    setInterval(bussinessLogic, 10000);

    return (
    <div>
      <div className="header">
        <img className="headerImage" alt = '' src = 'https://i.imgur.com/3Wgylws.png' ></img>
        <img className="headerImage" alt = '' src = 'https://media.indebuurt.nl/delft/2018/10/25104411/TU-Delft-logo-680x380.png'></img>
        <h1 className="inline">JIP Smart industry</h1>
      </div> 

      <div className="wrapper">

      <div className="first">
      <img className = 'profilePic' alt = '' src ='https://i.imgur.com/6lsQkmD.png'></img>
        <h1>Welcome Bank</h1>
        
      </div>

      <div className="second consoleWrapper">
        <div className="actionHeader">
        <h1>Choose your action</h1>
        </div>
        <div className="wrapper"> 
        
        <div className="second padding">
          <button className = 'queryButton' onClick = {handleQuery}>Query</button>
          <div className = "console">
            <pre>{JSON.stringify(responseQuery).replace(/\\/g, "").replace(/,/g, "\n")}</pre>
          </div>
        </div>


        </div>
        
      </div>

      </div>
      
    </div>)
  }

  const RenderDashBoard = () => {
    if(user.username === "buyer"){
      return (<BuyerDashboard/>)
    }else if (user.username === "seller"){
      return (<SellerDashboard/>)
    }else{
      return (<BankDashboard/>)
    }
  } 

  const RenderLogin = () => {
    return( <div className="app">
    <div className="login-form">
      <div className="title">Sign In</div>
      {renderForm}
    </div>
  </div>
    )
  }

  return (
    <div>
        {isSubmitted ? <RenderDashBoard/> : <RenderLogin/>}
    </div>
  );
}

export default App;