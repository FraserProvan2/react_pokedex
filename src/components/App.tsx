import React, { Component } from "react";

// Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowCircleLeft,
  faArrowCircleRight,
  faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";

// Components
import SearchPokemon from "./search/SearchPokemon";
import NextPrevious from "./NextPrevious";
import PokemonInfo from "./PokemonInfo";

// Models
import PokemonData from "./../models/PokemonData";
import PokemonSpeciesData from "./../models/PokemonSpeciesData";

// Helpers
import Utility from "../helpers/Utility";

// PokeAPI v2
const PokeApiWrapper = require("pokedex-promise-v2");
const PokeAPI = new PokeApiWrapper();

// Init Fa
library.add(faArrowCircleLeft, faArrowCircleRight, faQuestionCircle);

interface Props {}

interface State {
  pokemonData: PokemonData;
  pokemonSpeciesData: PokemonSpeciesData;
  error: "";
}

class App extends Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      pokemonData: {
        id: 0,
        name: "",
        sprites: {
          front_default: "",
          front_shiny: ""
        },
        height: "",
        weight: "",
        base_experience: 0,
        moves: [
          {
            move:
            {
              name: ""
            },
            version_group_details: [{
              level_learned_at: 0
            }
            ]
          }
        ],
        abilities: [],
        species: {
          url: ""
        },
        types: [
          {
            slot: 0,
            type: {
              name: ""
            }
          }
        ],
        stats: [
          {
            base_stat: 0,
            stat: {
              name: "string"
            }
          }
        ]
      },
      pokemonSpeciesData: {
        flavor_text_entries: [
          {
            language: {
              name: ""
            },
            flavor_text: ""
          }
        ],
          stats: [
            {
              base_stat: 0,
              stat: {
                name: ""
              },
            }
        ],
      },
      error: ""
    };

    // default ID
    this.setPokemonData(Utility.randomPokemonId());

    // Search functions bound
    this.setPokemonData = this.setPokemonData.bind(this);

    // Next Previous functions bound
    this.previousPokemon = this.previousPokemon.bind(this);
    this.nextPokemon = this.nextPokemon.bind(this);
    this.randomPokemon = this.randomPokemon.bind(this);
  }

  render() {
    return (
      <div className="App">
        {/* Search Box */}
        <div className="row justify-content-center mb-2">
          <div className="col-md-9">
            <SearchPokemon
              pokemonData={this.state.pokemonData}
              setPokemon={this.setPokemonData}
            />
          </div>
        </div>

        {/* Next - Previous */}
        <div className="row justify-content-center mb-2">
          <div className="col-md-9">
            <NextPrevious
              pokemonData={this.state.pokemonData}
              previousPokemon={this.previousPokemon}
              nextPokemon={this.nextPokemon}
              randomPokemon={this.randomPokemon}
            />
          </div>
        </div>

        {/* Pokemon Info */}
        <div className="row justify-content-center mb-2">
          <div className="col-md-9">
            <PokemonInfo
              pokemonData={this.state.pokemonData}
              PokemonSpeciesData={this.state.pokemonSpeciesData}
            />
          </div>
        </div>
      </div>
    );
  }

  // GET pokemon (PokeAPI v2)
  // param can either be a string to get data by Name, or a number to get by ID
  setPokemonData = (value: any) => {
    return PokeAPI.getPokemonByName(value)
      .then((pokemonData: any) => {
        this.setState({ pokemonData });

        // Set other related data
        this.setPokemonSecondaryData();
      })
      .catch((error: any) => {
        this.setState({ error });
      });
  };

  setPokemonSecondaryData = () => {
    // set Species Data
    PokeAPI.resource(this.state.pokemonData.species.url).then(
      (pokemonSpeciesData: any) => {
        this.setState({ pokemonSpeciesData });
      }
    );
  };

  previousPokemon = () => {
    this.setPokemonData(this.state.pokemonData.id - 1);
  };

  nextPokemon = () => {
    this.setPokemonData(this.state.pokemonData.id + 1);
  };

  randomPokemon = () => {
    this.setPokemonData(Utility.randomPokemonId());
  };
}

export default App;
