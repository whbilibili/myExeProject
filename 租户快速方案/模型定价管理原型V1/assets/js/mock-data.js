// 模型定价 mock 数据
// 价格单位：人民币（元）/ 每 1k tokens
// level 可取：A、B、C、试用、内部

const MockModelsPricing = [
  { id: '1', vendor: 'OpenAI', modelName: 'GPT-4o', priceInputPerK: 3.50, priceOutputPerK: 10.00, level: 'A', description: '通用多模态旗舰模型' },
  { id: '2', vendor: 'OpenAI', modelName: 'GPT-4o mini', priceInputPerK: 0.60, priceOutputPerK: 1.20, level: 'B', description: '高性价比模型' },
  { id: '3', vendor: 'Anthropic', modelName: 'Claude 3.5 Sonnet', priceInputPerK: 3.00, priceOutputPerK: 15.00, level: 'A', description: '强推的推理与长文本' },
  { id: '4', vendor: 'Anthropic', modelName: 'Claude 3 Haiku', priceInputPerK: 0.25, priceOutputPerK: 1.25, level: 'B', description: '轻量快速' },
  { id: '5', vendor: 'Google', modelName: 'Gemini 1.5 Pro', priceInputPerK: 2.80, priceOutputPerK: 8.00, level: 'A', description: '多模态与工具使用' },
  { id: '6', vendor: 'Google', modelName: 'Gemini 1.5 Flash', priceInputPerK: 0.20, priceOutputPerK: 0.60, level: 'B', description: '超快、低延迟' },
  { id: '7', vendor: '阿里', modelName: '通义千问-Qwen2-72B', priceInputPerK: 1.50, priceOutputPerK: 3.00, level: 'B', description: '中文理解优秀' },
  { id: '8', vendor: '字节', modelName: '豆包-pro', priceInputPerK: 0.30, priceOutputPerK: 0.80, level: 'C', description: '性价比选择' },
  { id: '9', vendor: '百度', modelName: '文心一言4.0', priceInputPerK: 1.80, priceOutputPerK: 6.00, level: 'B', description: '企业级通用模型' },
  { id: '10', vendor: 'MiniMax', modelName: 'abab 6.5s', priceInputPerK: 0.28, priceOutputPerK: 0.70, level: 'C', description: '对话场景友好' },
  { id: '11', vendor: 'OpenAI', modelName: 'o3-mini', priceInputPerK: 1.10, priceOutputPerK: 2.40, level: '试用', description: '内部灰度' },
  { id: '12', vendor: '自研', modelName: 'Internal-X', priceInputPerK: 0.00, priceOutputPerK: 0.00, level: '内部', description: '内部专用模型' },
];


