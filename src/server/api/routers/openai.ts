import { z } from "zod";
import { OpenAI } from "openai";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const {
    OPEN_API_KEY
} = process.env;

const messagesSchema = z.object({
    content: z.string(),
    role: z.union([z.literal('system'), z.literal('user'), z.literal('assistant')])
});

const generateAnswersSchema = z.object({
    question: z.string(),
    messages: z.array(messagesSchema),
    model: z.string(),
});

export const openaiRouter = createTRPCRouter({
    generateAnswers: publicProcedure
        .input(generateAnswersSchema)
        .mutation(async ({ ctx, input }) => {
            const { question, messages, model } = input;
            const openai = new OpenAI({ apiKey: OPEN_API_KEY});

            const answers = await openai.chat.completions.create({
                messages,
                model
            });

            if (answers.choices[0] === undefined) throw new Error('No answer generated');

            return answers.choices[0]?.message;
        }),
});
