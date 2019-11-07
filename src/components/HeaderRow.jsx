import React from "react";
import Grid from "@material-ui/core/Grid";

const HeaderRow = props => {
  return (
    <Grid xs={12} item style={{ backgroundColor: "#CC0000", color: "white" }}>
      <h1 style={{ padding: "10px", textAlign: "center" }}>The Recipe Guru</h1>
      <div style={{ padding: "10px" }}>{props.isLoading ? `LOADING!` : ``}</div>
    </Grid>
  );
};

export default HeaderRow;
