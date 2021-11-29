import { useState } from "react";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
const axios = require('axios').default;

export default function TextInput({ text, setText, textList, setTextList, metrics, setmetrics, model }) {

    const [textRef, setTextRef] = useState("");
    const [busy, setBusy] = useState(false);

    function handleChange(event) {
        setText(event.target.value);
        setTextRef(event.target.value);
    }
    function handleRefChange(event) {
        setTextRef(event.target.value);
    }

    function submit(event) {

        let url = `http://${window.location.hostname}:8000/prediction`;

        event.preventDefault();

        setBusy(true);

        axios.post(url, {
            text: text, reference: textRef, modelId: model
        }, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            }
        }).then((response) => {
            setBusy(false);
            setTextList(textList.concat({ "id": Math.random().toString(36).substr(2, 9), "text": model + " summarized: " + response.data.summarized + "\n" + response.data.metrics }));
            setmetrics(response.data.metrics);
        })
    }

    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '100ch' },
            }}
            noValidate
            autoComplete="off">
            <div>
                <Stack direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={{ xs: 1, sm: 2, md: 4 }}>
                    <TextField label="Raw Text"
                        multiline value={text}
                        placeholder="Input text summary."
                        onChange={handleChange} disabled={busy} minLength={30}
                        required={true} resize="none" />
                    {busy ?
                        (<CircularProgress />) : (<Button type="submit" onClick={submit}
                            variant="contained" endIcon={<SendIcon />}
                            size="large" ><span>Summarize</span></Button>)}
                </Stack>
                <TextField
                    label="Reference Text"
                    value={textRef}
                    placeholder="Input reference summary."
                    onChange={handleRefChange}
                    multiline
                    maxRows={3}
                    disabled={busy} />
            </div>
        </Box >
    );
}