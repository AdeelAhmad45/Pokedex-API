import { useEffect, useState } from "react";
import axios from "axios";
import './PokemonList.css'
import Pokemon from "../Pokemon/Pokemon";

function PokemonList() {

    const [PokemonList, setPokemonList] = useState([]);
    const [isLoading, setisLoading] = useState(true);

    const [pokedexURL, setPokedexUrl] = useState('https://pokeapi.co/api/v2/pokemon')
    const [nextUrl, setNextUrl] = useState('')
    const [prevUrl, setPrevUrl] = useState('')
 
    async function downloadPokemon() {
        setisLoading(true);
        const response = await axios.get(pokedexURL); // this download 20 pokemon List 
        const pokemonResults = response.data.results; // we get the array of pokemons from result
        console.log(response.data);
        setNextUrl(response.data.next);
        setPrevUrl(response.data.previous)

        // Iterating over the array of pokemons, and using their url to create an array of promises that will download those 20 pokemons
        const pokemonResultPromise = pokemonResults.map((pokemon) => axios.get(pokemon.url));

        // passing that promise array to axios.all
        const pokemonData = await axios.all(pokemonResultPromise);

       console.log(pokemonData);

       // now iterate on that of each pokemons , extract id, name, image 
       const res = pokemonData.map((pokedata)=> {
        const pokemon = pokedata.data;
        return{
            id: pokemon.id,
            name: pokemon.name,
            image: (pokemon.sprites.other) ? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_shiny,
            types: pokemon.types
        }
        })
       console.log(res);
       setPokemonList(res);
        setisLoading(false);
    }

    useEffect(()=>{
      downloadPokemon();
    },[pokedexURL])

    
    return(
     
        <div className="pokemon-list-wrapper">
           {/* <div>Pokemon List</div>  */}
           <div className="pokemon-wrapper">
           {(isLoading) ? 'Loading...': 
               PokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} />)
    }
           </div>
           <div className="controls">
            <button disabled={prevUrl== undefined} onClick={() => setPokedexUrl(prevUrl)} >Prev</button>
            <button disabled={nextUrl== undefined}  onClick={() => setPokedexUrl(nextUrl)} >Next</button>
           </div>
        </div>
        
        
    )
}

export default PokemonList;