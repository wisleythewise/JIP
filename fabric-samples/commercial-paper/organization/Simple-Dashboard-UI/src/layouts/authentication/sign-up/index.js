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

// react-router-dom components
// import { Link } from "react-router-dom";

import { userRandomData } from "../../../Context"
// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
// import Grid from "@mui/material/Grid";
import MDButton from "components/MDButton";

// Authentication layout components
// import CoverLayout from "layouts/authentication/components/CoverLayout";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Context } from "../../../Context";
import React, { useContext } from "react";

function Cover() {
  const [context, setContext] = useContext(Context);


  const ip = "localhost"

  const handleIssue = (event) => {
    event.preventDefault();

    console.log(event)
    console.log("ja")
    console.log(document.forms[0].amount)


    var { amount, price, docNumber } = document.forms[0];

    // add the hooks
    const datas = {
      amount: amount.value,
      price: price.value,
      docNumber: docNumber.value,
    };

    const reponse = fetch("http://" + ip + ":8080/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: datas }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log("There is a problem issueing a request");
        }
      );

    return reponse;
  };

  return (
    <DashboardLayout>
      {context === "buyer" ?  <MDBox pt={6} pb={3}>
        <Card>
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="success"
            mx={2}
            mt={-3}
            p={3}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Issue an order request
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              the issues are stored on the blockchain
            </MDTypography>
          </MDBox>
          <MDBox pt={10} pb={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox mb={4}>
                <MDInput type="text" label="Request number" name = "docNumber" variant="standard" fullWidth />
              </MDBox>
              <MDBox mb={4}>
                <MDInput type="text" label="Quantity in kg's" name = "amount" variant="standard" fullWidth />
              </MDBox>
              <MDBox mb={4}>
                <MDInput type="text" label="Price in euro's" name = "price" variant="standard" fullWidth />
              </MDBox>
              <MDBox display="flex" alignItems="center" ml={-1}>
                <Checkbox />
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color="text"
                  sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                >
                  &nbsp;&nbsp;I agree the&nbsp;
                </MDTypography>
                <MDTypography
                  component="a"
                  href="#"
                  variant="button"
                  fontWeight="bold"
                  color="info"
                  textGradient
                >
                  Terms and Conditions
                </MDTypography>
              </MDBox>
              <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" fullWidth onClick = {(e) => {handleIssue(e)}}>
                  Issue the order
                </MDButton>
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>
      </MDBox>:  <MDBox pt={6} pb={3}>
        <Card>
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="success"
            mx={2}
            mt={-3}
            p={3}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              You are not allowed to submit requests
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              Ask the buyer to provide a request
            </MDTypography>
          </MDBox>
        </Card>
      </MDBox>}
     
    </DashboardLayout> 
  );
}

export default Cover;
