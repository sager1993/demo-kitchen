//  React imports
import React, { Component } from "react";
import "./App.css";
import axios from "axios";

//  Material UI imports
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

//  Components Imports
import HeaderRow from "./components/HeaderRow.jsx";

//  Main app class
class App extends Component {
  //  API url
  apiURL =
    "https://cors-anywhere.herokuapp.com/http://www.recipepuppy.com/api/?";

  constructor(props) {
    super(props);
    //  Declaring states
    this.state = {
      //  API state
      isLoading: false,
      //  Searched Recipes
      recipes: [],
      //  Added Ingredients
      ingredientsList: [],
      //  Saved Recipes
      favoriteRecipes: [],
      //  Add new Ingredient
      newIngredient: "",
      //  Edit Ingredient states
      editIngredient: "",
      editIndex: null,
      showEdit: false
    };
  }

  //  API call function
  apiCall = async url => {
    try {
      this.setState({ isLoading: true });
      const response = await axios.get(url);
      this.setState({ isLoading: false });
      const recipeArr = response.data.results;
      this.setState({ recipes: recipeArr });
    } catch (err) {
      console.log(err);
    }
  };

  //  Did mount for intial call the API
  componentDidMount() {
    this.apiCall(this.apiURL);
  }

  //  Call the API if saved ingredients change
  componentDidUpdate(prevProps, prevState) {
    const oldListCSV = prevState.ingredientsList.join(",");
    const newListCSV = this.state.ingredientsList.join(",");
    if (newListCSV !== oldListCSV) {
      this.apiCall(`${this.apiURL}i=${newListCSV}`);
    }
  }

  //  Add ingredient function
  addIngredient = e => {
    e.preventDefault();
    this.setState(state => {
      return {
        ingredientsList: [...state.ingredientsList, state.newIngredient],
        newIngredient: ""
      };
    });
  };

  //  Delete all ingredients function
  deleteAll = e => {
    e.preventDefault();
    this.setState(state => {
      return {
        ingredientsList: []
      };
    });
  };

  //  Build the Recipes from the given array, and show them in a card
  buildGrid(recipeArray) {
    return recipeArray.map((recipe, index) => {
      return (
        <Grid xs={4} item key={index}>
          <Card style={{ margin: "10px" }}>
            <CardHeader title={recipe.title} subheader={recipe.ingredients} />
            <CardMedia image={recipe.thumbnail} title={recipe.title} />
            <CardActions>
              <Link href={recipe.href} target="_blank">
                Recipe Page
              </Link>
              <Button size="small" onClick={this.saveRecipe.bind(this, recipe)}>
                Save Recipe
              </Button>
            </CardActions>
          </Card>
        </Grid>
      );
    });
  }

  //  remove a specific ingredient
  removeIngredient(index) {
    this.setState(state => {
      const newList = [...this.state.ingredientsList];
      newList.splice(index, 1);
      return {
        ingredientsList: newList
      };
    });
  }

  //  Save the Recipe
  saveRecipe(recipe) {
    this.setState(state => {
      const newList = [...this.state.favoriteRecipes, recipe];
      console.log(newList);
      return {
        favoriteRecipes: newList
      };
    });
  }

  //  Build and show the list of ingriedients
  buildList() {
    //  Return the saved the ingriedients, map through them then return components
    return this.state.ingredientsList.map((ingred, index) => {
      //  return a component for ingriedient as grid item, with the text as a card
      return (
        //  index every item
        <Grid xs={12} item key={index}>
          <Card style={{ padding: "5px", margin: "5px", display: "flex" }}>
            <h4
              style={{ padding: "10px", display: "flex-inline", flexGrow: "1" }}
            >
              {ingred}
            </h4>
            {/* Edit item button */}
            <Button
              variant="outlined"
              color="primary"
              style={{ display: "block", margin: "auto 10px" }}
              onClick={this.handleEditOpen.bind(this, index, ingred)}
            >
              Edit
            </Button>
            {/* Delete item button */}
            <Button
              color="secondary"
              onClick={this.removeIngredient.bind(this, index)}
              style={{ display: "block", margin: "auto 10px" }}
            >
              Delete
            </Button>
          </Card>
        </Grid>
      );
    });
  }

  /* Edit Section */
  //  Closing of the edit
  handleClose = () => {
    this.setState(() => {
      return {
        showEdit: false,
        editIndex: null,
        editIngredient: ""
      };
    });
  };

  //  Open the ingrdient edit
  handleEditOpen = (index, ingred) => {
    this.setState(() => {
      return {
        showEdit: true,
        editIngredient: ingred,
        editIndex: index
      };
    });
  };

  //  Submit the edit
  handleEditSubmit = e => {
    e.preventDefault();
    this.setState(state => {
      const newList = [...state.ingredientsList];
      newList[state.editIndex] = state.editIngredient;
      return {
        ingredientsList: newList
      };
    });
    this.handleClose();
  };

  render() {
    return (
      <Grid container>
        {/* Header Row */}
        <HeaderRow isLoading={this.state.isLoading} />

        {/* Body Columns */}
        {/* List Item Column */}
        <Grid xs={3} item>
          <Card color="primary" style={{ margin: "10px" }}>
            <CardHeader title="Ingredients List" />
            <hr style={{ margin: "10px" }}></hr>
            {/* Text field to add an ingredient */}
            <form onSubmit={this.addIngredient}>
              <TextField
                style={{ margin: "10px", display: "flex", flexGrow: "1" }}
                label="Add Ingredient"
                variant="outlined"
                value={this.state.newIngredient}
                onInput={e => this.setState({ newIngredient: e.target.value })}
              />
              <button
                onClick={this.addIngredient}
                style={{ display: "block", margin: "auto 10px" }}
              >
                Add Ingredient
              </button>
              <button
                onClick={this.deleteAll}
                style={{ display: "block", margin: "auto 10px" }}
              >
                Clear the List
              </button>
            </form>
            {/* show saved ingredients */}
            {this.buildList()}
          </Card>
          {/* Edit Prompt */}
          <Dialog
            open={this.state.showEdit}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Edit Item</DialogTitle>
            <form onSubmit={this.handleEditSubmit}>
              <TextField
                style={{ margin: "10px", display: "flex", flexGrow: "1" }}
                label="Edit Ingredient"
                variant="outlined"
                value={this.state.editIngredient}
                onInput={e => this.setState({ editIngredient: e.target.value })}
              />
            </form>
            <DialogActions>
              <Button onClick={this.handleClose}>Close</Button>
              <Button onClick={this.handleEditSubmit} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
          {/* End of the edit prompt */}
        </Grid>
        {/* list recipes */}
        <Grid xs={9} item>
          {/* List Searched Recipes*/}
          <h1>Seaches</h1>
          <Grid container>{this.buildGrid(this.state.recipes)}</Grid>
          {/* List Saved Recipes*/}
          <h1>Saved Recipes</h1>
          <Grid container>{this.buildGrid(this.state.favoriteRecipes)}</Grid>
        </Grid>
      </Grid>
    );
  }
}

export default App;
