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

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
// import projectsTableData from "layouts/tables/data/projectsTableData";
import React, { useState } from "react";

function Tables() {
  const [responseQuery, setResponseQuery] = useState("");
  const { columns, rows } = authorsTableData(responseQuery);

  const ip = "localhost";

  const handleQuery = () => {
    const response = fetch(`http://${ip}:8080/query`)
      .then((res) => res.json())
      .then(
        (result) => {
          setResponseQuery(result);
        },
        (error) => {
          console.log("There is a problem reaching the server");
          console.log(error);
        }
      );

    return response;
  };

  return (
    <DashboardLayout>
      {/* <DashboardNavbar /> */}
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Transactions
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
              <MDBox mt={4} mb={1} mx={2} py={3} px={2}>
                <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  onClick={() => {
                    handleQuery();
                  }}
                >
                  Query the data
                </MDButton>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Tables;
