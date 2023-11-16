import { Configuration, OpenAIApi } from 'openai';

const config = new Configuration({
  apiKey: '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'
});

const openai = new OpenAIApi(config);

export default openai;