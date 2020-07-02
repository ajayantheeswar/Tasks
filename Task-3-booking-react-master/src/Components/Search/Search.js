import React from 'react';
import classes from './Search.module.css';

const Search = props => (
    <div className={classes['Search-container']}>
        <input type="text" onChange={(event) => props.onChange(event,'origin')} value={props.source} placeholder="Source"/>
        <input type="text" onChange={(event) => props.onChange(event,'destination')} value={props.destination} placeholder="Destination" />
        <button onClick={props.onSearch}>Search</button>
    </div>
);

export default Search;