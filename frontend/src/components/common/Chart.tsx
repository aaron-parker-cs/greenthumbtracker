import { 
    Container,
 } from 'react-bootstrap';
 import React from 'react';

export default function Chart(props){

    const style = {
        margin: "0",
        padding: "0",
        border: "2px solid black", 
        minWidth: "20vw", 
        maxWidth: "20vw", 
        height: "25vh", 
        display: "block"
    };

    return (
        <Container style={style} className="m-5">
            <p>{props.text}</p>
        </Container>
    );
}