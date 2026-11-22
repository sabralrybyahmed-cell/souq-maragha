require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

if (!process.env.SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('خطأ: بيانات Supabase غير موجودة في ملف .env');
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.get('/api/health', async (req, res) => {
  try {
    const { error } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (error) throw error;

    res.json({
      status: 'ok',
      database: 'connected',
      message: 'سوق المراغة متصل بقاعدة البيانات'
    });
  } catch (error) {
    console.error('Database error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'فشل الاتصال بقاعدة البيانات'
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log('Souq Maragha running on port ' + PORT);
});
