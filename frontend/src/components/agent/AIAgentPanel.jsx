import React, { useMemo, useState } from 'react';
import { chatWithAgent } from '../../services/api';

const AIAgentPanel = () => {
    const [messages, setMessages] = useState([
        {
            role: 'agent',
            text: 'Hi, I am your AI coding guide. Ask me what to build or learn next.',
        },
    ]);
    const [input, setInput] = useState('');
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);

    const placeholder = useMemo(() => 'Ask coding/roadmap questions...', []);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;

        const userMessage = { role: 'user', text };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');

        try {
            setLoading(true);
            const data = await chatWithAgent({
                message: text,
                context: {
                    source: 'right-panel',
                },
            });
            setMessages((prev) => [...prev, { role: 'agent', text: data.reply }]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'agent',
                    text: error.message || 'Unable to fetch agent response right now.',
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <aside className={`ai-agent${open ? ' open' : ''}`}>
            <button
                type="button"
                className="ai-agent-toggle"
                onClick={() => setOpen((prev) => !prev)}
                aria-label={open ? 'Collapse AI assistant' : 'Open AI assistant'}
            >
                {open ? 'AI Guide -' : 'AI Guide +'}
            </button>

            {open && (
                <div className="ai-agent-card">
                    <div className="ai-agent-header">
                        <h4>AI Guide</h4>
                        <span>Online</span>
                    </div>

                    <div className="ai-agent-messages">
                        {messages.map((message, idx) => (
                            <div key={`${message.role}-${idx}`} className={`ai-msg ${message.role}`}>
                                {message.text}
                            </div>
                        ))}
                        {loading && <div className="ai-msg agent">Thinking...</div>}
                    </div>

                    <div className="ai-agent-input-wrap">
                        <input
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') sendMessage();
                            }}
                            className="ai-agent-input"
                            placeholder={placeholder}
                            disabled={loading}
                        />
                        <button type="button" className="ai-agent-send" onClick={sendMessage} disabled={loading}>
                            {loading ? '...' : 'Send'}
                        </button>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default AIAgentPanel;
