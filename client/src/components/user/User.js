import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import "./User.css";

export default function Example() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    // runs every time a page render happens (see below comment)
    useEffect(() => {
        (async() => {
            try {
                const response = await fetch("http://localhost:3001/hello");
                const result = await response.json();
                console.log(result);
            } catch (error) {
                console.error(error);
                return;
            }
        })();
    // unless these brackets are provided as an optional parameter here, meaning it will run one time ever on initial page render
    // state variables from above can be included in the bracket, which will mean this code will run every time the variable changes
    }, []);

    const login = async() => {
        setMessage("");
        let result;
        
        try {
            const response = await fetch("http://localhost:3001/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });
            result = await response.json();
        } catch (error) {
            console.error(error);
            return;
        }

        setMessage(result.message);

        if (result.status === 200) {
            setUsername("");
            setPassword("");
        }
    };
    
    const createAccount = async() => {
        setMessage("");
        let result;
        
        try {
            const response = await fetch("http://localhost:3001/createAccount", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });
            result = await response.json();
        } catch (error) {
            console.error(error);
            return;
        }

        setMessage(result.message);

        if (result.status === 200) {
            setUsername("");
            setPassword("");
        }
    };

    return (
        <div className="user-component">
            <TextField label="Username" variant="outlined" value={username} onChange={(event) => setUsername(event.target.value)} />
            <br />
            <TextField label="Password" variant="outlined" value={password} onChange={(event) => setPassword(event.target.value)} sx={{marginTop: "10px"}} />
            <br />
            <Button variant="contained" onClick={createAccount}>Create Account</Button>
            &emsp;
            <Button variant="contained" onClick={login}>Login</Button>
            <br/>
            {message ? <p>{message}</p> : null}
        </div>
    );
}