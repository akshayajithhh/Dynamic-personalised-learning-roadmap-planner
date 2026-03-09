const extractReplyText = (providerResponse) => {
    const content = providerResponse?.choices?.[0]?.message?.content;
    if (typeof content === 'string') return content.trim();
    if (Array.isArray(content)) {
        return content
            .map((part) => (typeof part === 'string' ? part : part?.text || ''))
            .join(' ')
            .trim();
    }
    return '';
};

// @desc    Chat with coding agent provider via API key
// @route   POST /api/agent/chat
// @access  Private
export const chatWithAgent = async (req, res) => {
    try {
        const { message, context } = req.body || {};
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }
        if (message.length > 4000) {
            return res.status(400).json({ success: false, message: 'Message is too long' });
        }

        const apiKey = process.env.CODING_AGENT_API_KEY || process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({
                success: false,
                message: 'Missing CODING_AGENT_API_KEY in backend environment',
            });
        }

        const apiUrl = process.env.CODING_AGENT_API_URL || 'https://api.openai.com/v1/chat/completions';
        const model = process.env.CODING_AGENT_MODEL || 'gpt-4o-mini';
        const temperature = Number(process.env.CODING_AGENT_TEMPERATURE || 0.3);

        const userName = req.user?.name || 'Learner';
        const domain = context?.domain || 'general software learning';
        const level = context?.level || 'not specified';

        const systemPrompt =
            'You are a practical coding learning assistant. Give concise, actionable guidance with steps and tradeoffs. Avoid fluff.';

        const providerRes = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                temperature,
                messages: [
                    { role: 'system', content: systemPrompt },
                    {
                        role: 'user',
                        content: `User: ${userName}\nDomain: ${domain}\nLevel: ${level}\nQuestion: ${message}`,
                    },
                ],
            }),
        });

        const providerJson = await providerRes.json();
        if (!providerRes.ok) {
            const providerMessage =
                providerJson?.error?.message || providerJson?.message || 'Coding agent provider request failed';
            return res.status(providerRes.status).json({
                success: false,
                message: providerMessage,
            });
        }

        const reply = extractReplyText(providerJson);
        if (!reply) {
            return res.status(502).json({
                success: false,
                message: 'Provider returned an empty response',
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                reply,
                model,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to chat with coding agent',
        });
    }
};

