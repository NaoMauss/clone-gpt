import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Paper, List, ListItem, Divider } from '@mui/material';
import { api } from "~/utils/api";

import Message from './Message';

interface IMessage {
    content: string;
    role: 'user' | 'system' | 'assistant';
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<IMessage[]>([{ content: 'Hello', role: 'user' }]);
    const [input, setInput] = useState<string>('');
    const [model, setModel] = useState<string>('gpt-3.5-turbo-1106');
    const bottomRef = useRef<null | HTMLDivElement>(null);

    const sendMessageMutation = api.openai.generateAnswers.useMutation({
        onSuccess: (data) => {
            if (!data?.content) return;
            setMessages([...messages, { content: data.content, role: 'assistant' }]);
        },
    });
    const sendMessage = async () => {
        if (!input) return;

        const newMessage: IMessage = { content: input, role: 'user' };
        setMessages([...messages, newMessage]);
        
        sendMessageMutation.mutate({ model, messages: [...messages, newMessage], question: input });

        setInput('');
    }

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <>
            <Paper style={{ height: '90vh', overflow: 'auto', padding: '20px' }}>
                <List>
                    {messages.map((message, index) => (
                        <React.Fragment key={index}>
                            <ListItem
                                sx={{
                                    display: 'flex',
                                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                                    width: '100%',
                                }}
                            >
                                <Message content={message.content} role={message.role} />
                            </ListItem>
                            {index < messages.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                    <div ref={bottomRef} />
                </List>
            </Paper>
            <Box
                component="form"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px', marginBottom: '20px', width: '90%' }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={async (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            await sendMessage();
                            setInput('');
                        }
                    }}
                    sx={{ marginRight: '10px', marginLeft: '30px' }}
                />
                <Button variant="contained" color="primary" onClick={sendMessage}>
                    Send
                </Button>
            </Box>
        </>
    );
}
