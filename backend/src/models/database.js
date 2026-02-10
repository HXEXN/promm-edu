import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '../../data.db'));

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    progress TEXT DEFAULT '{}',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS prompts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER DEFAULT 1,
    role_text TEXT,
    context_text TEXT,
    action_text TEXT,
    model_used TEXT,
    token_count INTEGER,
    efficiency_score INTEGER,
    hardware_command TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    order_index INTEGER,
    difficulty TEXT,
    goal TEXT,
    hints TEXT,
    validation_rules TEXT,
    example_role TEXT,
    example_context TEXT,
    example_action TEXT
  );
`);

// Insert default user
const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (id, username, email, progress)
  VALUES (1, 'student', 'student@smartfarm.edu', '{"completed": 0, "total": 5}')
`);
insertUser.run();

// Insert sample lessons
const insertLesson = db.prepare(`
  INSERT OR IGNORE INTO lessons (id, title, content, order_index, difficulty, goal, hints, validation_rules, example_role, example_context, example_action)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const lessons = [
  [
    1,
    '기본 프롬프트 작성',
    '역할, 상황, 행동을 구조화하여 효율적인 프롬프트를 작성하는 방법을 배웁니다.',
    1,
    'beginner',
    '20토큰 이하로 물펌프를 제어하는 프롬프트를 작성하세요',
    JSON.stringify(['역할, 상황, 행동을 간결하게 작성하세요', '불필요한 형용사를 제거하세요', '"물"이나 "펌프" 키워드를 포함하세요']),
    JSON.stringify({ maxTokens: 20, requiredDevice: 'pump' }),
    '관리자',
    '토양 건조',
    '물 공급'
  ],
  [
    2,
    '토큰 최적화 기법',
    '불필요한 단어를 제거하고 명확한 지시로 토큰 비용을 절감하는 방법을 학습합니다.',
    2,
    'beginner',
    '15토큰 이하로 물펌프를 제어하는 프롬프트를 작성하세요',
    JSON.stringify(['더 짧은 단어를 사용하세요', '조사를 최소화하세요', '핵심 명령만 남기세요']),
    JSON.stringify({ maxTokens: 15, requiredDevice: 'pump' }),
    '관리자',
    '건조',
    '급수'
  ],
  [
    3,
    '하드웨어 제어 명령',
    '스마트팜 장치를 제어하기 위한 효과적인 프롬프트 패턴을 익힙니다.',
    3,
    'intermediate',
    '18토큰 이하로 팬 또는 LED를 제어하는 프롬프트를 작성하세요',
    JSON.stringify(['상황에 맞는 장치를 선택하세요', '"환기" 또는 "조명" 키워드를 사용하세요', '동작 시간을 명시하지 않아도 됩니다']),
    JSON.stringify({ maxTokens: 18, requiredDevices: ['fan', 'led'] }),
    '관리자',
    '온도 높음',
    '환기'
  ],
  [
    4,
    '상황별 대응 전략',
    '다양한 환경 조건에 맞는 적응형 프롬프트를 작성합니다.',
    4,
    'intermediate',
    '25토큰 이하로 복합 상황에 대응하는 프롬프트를 작성하세요',
    JSON.stringify(['여러 조건을 동시에 고려하세요', '우선순위가 높은 조치를 먼저 명시하세요', '상황 설명을 구체적으로 작성하세요']),
    JSON.stringify({ maxTokens: 25, requiresCommand: true }),
    '관리자',
    '토양 건조하고 온도 높음',
    '물 공급 후 환기'
  ],
  [
    5,
    '고급 최적화 기술',
    '복합 명령어와 조건부 로직을 포함한 고급 프롬프트를 마스터합니다.',
    5,
    'advanced',
    '10토큰 이하로 어떤 장치든 제어하는 프롬프트를 작성하세요',
    JSON.stringify(['최소한의 단어만 사용하세요', '한글자 단어를 활용하세요', '맥락을 최대한 줄이세요']),
    JSON.stringify({ maxTokens: 10, requiresCommand: true }),
    '관리자',
    '건조',
    '물'
  ]
];

lessons.forEach(lesson => {
  try {
    insertLesson.run(...lesson);
  } catch (err) {
    // Lesson already exists
  }
});

export default db;
