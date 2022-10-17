/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/* eslint-disable */
/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import React, { useState } from "react";
import { useContext } from "react";
import { Context } from "../../../Context";


export default function data(queryBlock) {
  const [context, setContext] = useContext(Context);


  var ip = "localhost"
  
  const outstandingRequest = eval(queryBlock.Outstanding_requests_buyer)
  const approvedRequestSeller = eval(queryBlock.approves_requests_seller)
  const LoCs = eval(queryBlock.LOCs)
  
  if(LoCs){
    var keyLoCs = LoCs.map((key) =>  key.Record.paperNumber)
  } else {
    var keyLoCs = []
  }
  
  const status = {
    0: "Issued",
    1: "Approved",
    2: "LoC",
  };

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
       return reponse
   }
 
   const bussinessLogic = () =>{
 
    
 
     if (approvedRequestSeller){

      console.log(approvedRequestSeller)
       const lengthArray = approvedRequestSeller.length
       for(var i = 0 ; i < lengthArray; i ++ ){
 
         // enter the bussiness logic for the bank
         const amount = parseInt(approvedRequestSeller[i].Record.amount);
         const price = parseInt(approvedRequestSeller[i].Record.price);
         const docNumber = parseInt(approvedRequestSeller[i].Record.paperNumber);
 
         if(amount > 100 && amount/price < 10){
           turnIntoLoc(docNumber)
           console.log(`Turn Order #${docNumber} into a LoC`)
         }
         
       }
     }
 
       return
   }


  if (context == "bank"){
    console.log("looking for LoC viable options")
    var interval = setInterval(bussinessLogic, 20000);
  } else {
    console.log("killing interval")
    clearInterval(interval)
  }
   
  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  


  const approveRequest = (Record) => {

    console.log("this is recrod", Record.key.Record)

    const ip = "localhost";

    var {amount, price , paperNumber } = Record.key.Record;

    // add the hooks 
    const datas = {
      amount : amount, 
      price : price,
      docNumber : paperNumber,
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
      (error) => {
        console.log("There is a problem approving" + error)
      })

      return reponse
  }


  if(outstandingRequest){

    var outstandingRequestMapped = outstandingRequest.map((key) => ({
    Order: <Job title="#" description={key.Record.paperNumber} />,
    Specs: <Job title={`Amount in Kg's: ${key.Record.paperNumber}`} description={`Price in Euros: ${key.Record.price}`}/>,
    Status: (
      <MDBox ml={-1}>
        <MDBadge badgeContent={status[0]} color="error" variant="gradient" size="sm" />
      </MDBox>
    ),
    Updated: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {key.Record.issueDateTime}
      </MDTypography>
    ),
    action: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        <MDBox mt={1} mb={1} mx={1} py={1} px={1}>
        {context == "seller" ? 
        <MDButton variant="gradient" color="info" fullWidth onClick = {() => {approveRequest({key})}}>
            Approve
          </MDButton> : <></>}
        </MDBox>
      </MDTypography>
    )
    
  }))
  } else{
    var outstandingRequestMapped = []
  }

  console.log("THese are the approved request of the seller,", approvedRequestSeller)

  if(approvedRequestSeller){

    console.log(approvedRequestSeller)

    var approvedRequestSellerMapped = approvedRequestSeller.filter((key) => (!keyLoCs.includes(key.Record.paperNumber))  ).map((key) => ({
    
    Order: <Job title="#" description={key.Record.paperNumber} />,
    Specs: <Job title={`Amount in Kg's: ${key.Record.paperNumber}`} description={`Price in Euros: ${key.Record.price}`}/>,
    Status: (
      <MDBox ml={-1}>
        <MDBadge badgeContent={status[1]} color="info" variant="gradient" size="sm" />
      </MDBox>
    ),
    Updated: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {key.Record.issueDateTime}
      </MDTypography>
    ),
    action: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        <MDBox mt={1} mb={1} mx={1} py={1} px={1}>

        </MDBox>
      </MDTypography>
    )
    
  }))  
  } else {
    var approvedRequestSellerMapped = []
  }


  if(LoCs){

    var LoCsMapped = LoCs.map((key) => ({
    
    Order: <Job title="#" description={key.Record.paperNumber} />,
    Specs: <Job title={`Amount in Kg's: ${key.Record.paperNumber}`} description={`Price in Euros: ${key.Record.price}`}/>,
    Status: (
      <MDBox ml={-1}>
        <MDBadge badgeContent={status[2]} color="success" variant="gradient" size="sm" />
      </MDBox>
    ),
    Updated: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {key.Record.issueDateTime}
      </MDTypography>
    ),
    action: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        <MDBox mt={1} mb={1} mx={1} py={1} px={1}>
        </MDBox>
      </MDTypography>
    )
    
  }))  
  } else {
    var LoCsMapped = []
  }

  var concat = outstandingRequestMapped.concat(approvedRequestSellerMapped).concat(LoCsMapped)

  return {
    columns: [
      { Header: "Order", accessor: "Order", width: "45%", align: "left" },
      { Header: "Specs", accessor: "Specs", align: "left" },
      { Header: "Status", accessor: "Status", align: "center" },
      { Header: "Updated", accessor: "Updated", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: concat
  };
}
