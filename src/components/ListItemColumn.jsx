import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

const ListItemColumn = props => {
  return (
    <Grid xs={3} item>
      <Card color="primary" style={{ margin: "10px" }}>
        <CardHeader title="Ingredients List" />
        <hr style={{ margin: "10px" }}></hr>
        <form onSubmit={props.addIngredient}>
          <TextField
            style={{ margin: "10px", display: "flex", flexGrow: "1" }}
            label="Add Ingredient"
            variant="outlined"
            value={props.newIngredient}
            onInput={e => props.setState({ newIngredient: e.target.value })}
          />
          <button
            onClick={props.addIngredient}
            style={{ display: "block", margin: "auto 10px" }}
          >
            Add Ingredient
          </button>
          <button
            onClick={props.deleteAll}
            style={{ display: "block", margin: "auto 10px" }}
          >
            Clear the List
          </button>
        </form>
        {props.buildList()}
      </Card>
      <Dialog
        open={props.showEdit}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Edit Item</DialogTitle>
        <form onSubmit={props.handleEditSubmit}>
          <TextField
            style={{ margin: "10px", display: "flex", flexGrow: "1" }}
            label="Edit Ingredient"
            variant="outlined"
            value={props.state.editIngredient}
            onInput={e => props.setState({ editIngredient: e.target.value })}
          />
        </form>
        <DialogActions>
          <Button onClick={props.handleClose}>Close</Button>
          <Button onClick={props.handleEditSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};
export default ListItemColumn;
