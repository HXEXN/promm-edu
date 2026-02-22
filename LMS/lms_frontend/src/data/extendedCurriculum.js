// Extended curriculum: EU AI Act + Vendor-specific Prompt Engineering Guides
// These are appended to the base curriculum modules (IDs 5-9)

export const extendedCurriculum = [
    // ========== Module 5: EU AI Act ==========
    {
        id: 5,
        title: 'EU AI Act & AI 규제',
        duration: '1주',
        topics: ['EU AI Act 개요', '위험 등급 분류', '기업 의무사항', 'AI 리터러시'],
        lessons: [
            {
                id: '5-1',
                title: 'EU AI Act 핵심 이해',
                content: {
                    theory: `
## EU AI Act란?

EU AI Act(Regulation EU 2024/1689)는 세계 최초의 **포괄적 AI 법률 프레임워크**입니다.

### 핵심 목표
- **안전한 AI**: 인권과 안전을 보호하는 AI 개발
- **투명성**: AI 시스템의 의사결정 과정 설명 가능
- **책임성**: AI 개발자와 사용자의 명확한 책무
- **혁신 촉진**: 규제와 혁신의 균형

### 적용 범위
- EU 시장에서 AI를 제공하는 **모든 기업** (지리적 위치 무관)
- 역외 적용: 한국 기업도 EU에 서비스하면 적용됨

### 시행 일정
| 날짜 | 내용 |
|------|------|
| 2024.08.01 | 법률 발효 |
| 2025.02.02 | 금지 AI 관행 시행 + AI 리터러시 의무 |
| 2025.08.02 | 범용 AI(GPAI) 모델 의무 시행 |
| 2026.08.02 | 고위험 AI 시스템 요건 적용 |

### 위반 시 벌칙
- 금지 관행 위반: **최대 3,500만 유로** 또는 전세계 매출의 **7%**
- 고위험 요건 미준수: 최대 1,500만 유로 또는 3%
- 잘못된 정보 제공: 최대 750만 유로 또는 1%
                    `,
                    example: {
                        prompt: '우리 회사가 EU에 AI 채용 스크리닝 도구를 출시하려 합니다. EU AI Act 기준으로 이 도구의 위험 등급과 필요한 준비사항을 분석해주세요.',
                        explanation: 'AI 채용 도구는 EU AI Act에서 "고위험"으로 분류됩니다. 이 프롬프트로 구체적인 컴플라이언스 체크리스트를 받을 수 있습니다.',
                        expectedOutput: '채용 AI는 "고위험" 등급으로, 적합성 평가, 데이터 거버넌스, 인간 감독 메커니즘, 기술 문서화가 필요합니다.'
                    }
                },
                quiz: [
                    {
                        question: 'EU AI Act가 세계 최초로 시도한 것은?',
                        options: [
                            'AI 사용 전면 금지',
                            '포괄적 AI 규제 법률 프레임워크',
                            'AI 개발 면허 제도',
                            'AI 세금 부과'
                        ],
                        correct: 1
                    },
                    {
                        question: '금지 AI 관행 중 하나가 아닌 것은?',
                        options: [
                            '사회적 점수 매기기(Social Scoring)',
                            '실시간 원격 생체 인식',
                            '텍스트 요약 챗봇',
                            '감정 인식(직장/학교)'
                        ],
                        correct: 2
                    }
                ],
                practice: {
                    instruction: 'EU AI Act 위험 등급 분류를 직접 연습해 보세요. 아래 프롬프트의 AI 시스템을 분석하세요.',
                    initialPrompt: '다음 AI 시스템들의 EU AI Act 위험 등급을 분류하고, 각각에 필요한 컴플라이언스 요건을 설명해줘:\n1. 스팸 메일 필터\n2. 의료 영상 진단 AI\n3. 채용 이력서 스크리닝 AI\n4. AI 비디오 게임 NPC',
                    hints: [
                        '위험 등급은 금지, 고위험, 제한적 위험, 최소/무위험 4단계입니다',
                        '의료 기기와 채용은 고위험에 해당합니다',
                        '스팸 필터와 게임 NPC는 최소 위험입니다'
                    ]
                }
            },
            {
                id: '5-2',
                title: 'AI 리터러시와 기업 의무',
                content: {
                    theory: `
## AI 리터러시 의무 (2025.02.02 시행)

EU AI Act 제4조에 따라, AI를 사용하는 **모든 기업**은 직원들의 AI 리터러시를 보장해야 합니다.

### AI 리터러시란?
> AI 시스템을 **비판적으로 이해하고**, 위험을 인식하며, **책임감 있게 활용**할 수 있는 능력

### 기업이 해야 할 것
- **교육 프로그램** 수립 및 실시
- AI 시스템 사용자에게 **적절한 훈련** 제공
- 직원의 **기술 수준과 경험** 고려한 맞춤 교육
- 교육 이력 **문서화 및 기록 보관**

### 위험 등급별 의무사항

#### 🔴 금지 관행 (Unacceptable Risk)
- 인지 행동 조작 (취약 계층 대상)
- 사회적 점수 제도 (소셜 스코어링)
- 실시간 공공장소 생체 인식 (제한적 예외)
- 직장/학교 감정 인식
- 인터넷/CCTV 무차별 얼굴 데이터 수집

#### 🟠 고위험 (High Risk)
- **적합성 평가** 필수
- **위험 관리 시스템** 구축
- **데이터 거버넌스** (학습 데이터 품질 관리)
- **기술 문서화** 및 로깅
- **인간 감독** 메커니즘
- 정확성, 강건성, 사이버보안 요건

#### 🟡 제한적 위험 (Limited Risk)
- **투명성 의무**: AI와 상호작용 중임을 고지
- 챗봇, 딥페이크 등에 표시 필요

#### 🟢 최소 위험 (Minimal Risk)
- 특별 의무 없음 (자율 행동 강령 권장)

### 범용 AI(GPAI) 모델 추가 의무
- 기술 문서 유지
- 학습 데이터 저작권 정책 공개
- 체계적 위험 평가 및 완화
- 심각한 사건 보고 의무
                    `,
                    example: {
                        prompt: '우리 회사의 AI 리터러시 교육 프로그램을 EU AI Act 기준에 맞게 설계해줘. 직원 50명, IT 부서 10명, 마케팅 20명, 영업 20명 구성이야.',
                        explanation: '부서별 역할에 맞는 맞춤형 AI 리터러시 교육 커리큘럼을 생성합니다.',
                        expectedOutput: 'IT 부서: 기술적 AI 안전성 + 고위험 시스템 관리, 마케팅: 콘텐츠 AI 윤리 + 딥페이크 표시, 영업: 고객 대응 AI 투명성'
                    }
                },
                quiz: [
                    {
                        question: 'EU AI Act의 AI 리터러시 의무는 언제부터 시행되었나?',
                        options: ['2024년 8월', '2025년 2월', '2025년 8월', '2026년 8월'],
                        correct: 1
                    },
                    {
                        question: '고위험 AI 시스템에 해당하지 않는 것은?',
                        options: [
                            '채용 AI',
                            '의료 진단 AI',
                            '스팸 필터',
                            '교육 평가 AI'
                        ],
                        correct: 2
                    }
                ]
            }
        ]
    },

    // ========== Module 6: OpenAI 공식 프롬프트 엔지니어링 가이드 ==========
    {
        id: 6,
        title: 'OpenAI 공식 가이드',
        duration: '1주',
        topics: ['6대 전략', '명확한 지시', 'CoT', '외부 도구 활용'],
        lessons: [
            {
                id: '6-1',
                title: 'OpenAI 6대 프롬프트 전략',
                content: {
                    theory: `
## OpenAI 공식 프롬프트 엔지니어링 가이드

OpenAI는 GPT 모델의 성능을 극대화하기 위한 **6가지 핵심 전략**를 공식 제시합니다.

### 전략 1: 명확하고 구체적인 지시 (Write Clear Instructions)
GPT는 마음을 읽지 못합니다. 원하는 것을 **구체적으로** 설명하세요.

**핵심 기법:**
- 세부사항, 페르소나, 출력 형식을 명시
- 구분자(\`###\`, \`"""\`)로 입력 영역 분리
- 단계별로 수행할 작업 나열
- 예시를 제공하여 기대 출력을 시연
- 출력 길이를 명시 (단어 수, 문장 수 등)

### 전략 2: 참조 텍스트 제공 (Provide Reference Text)
환각(hallucination) 방지를 위해 **신뢰할 수 있는 참조 자료**를 포함합니다.

- 문서를 프롬프트에 포함하고 "이 문서를 기반으로 답하세요" 지시
- 인용(citation) 요청으로 답변의 근거를 명시화

### 전략 3: 복잡한 작업 분해 (Split Complex Tasks)
하나의 복잡한 요청보다 **여러 단순한 단계**로 나누면 오류가 줄어듭니다.

- 의도 파악 → 처리 → 검증의 파이프라인 구성
- 긴 대화는 이전 요약을 활용하여 컨텍스트 관리
- 문서를 청크로 나눠 재귀적 요약

### 전략 4: 생각할 시간 주기 (Give GPT Time to Think)
**Chain-of-Thought (CoT)** — "단계별로 생각하세요" 지시로 정확도 증가.

- "답을 내기 전에 풀이 과정을 보여주세요"
- 내부 추론을 먼저 수행 후 최종 답변 제시
- 이전 답변의 누락 여부를 자체 검토하도록 지시

### 전략 5: 외부 도구 활용 (Use External Tools)
GPT의 한계를 **다른 도구와 연동**하여 보완합니다.

- 정확한 계산: 코드 실행 엔진 연결
- 최신 정보: 검색 API 연동 (RAG)
- 벡터 DB를 활용한 임베딩 기반 검색

### 전략 6: 체계적 반복 테스트 (Test Changes Systematically)
프롬프트 변경 후 **정량적 평가**를 수행합니다.

- 대표 테스트 케이스 준비
- A/B 비교 방식으로 프롬프트 성능 측정
- "gold standard" 정답과 비교하여 정확도 계산
                    `,
                    example: {
                        prompt: `당신은 시니어 데이터 분석가입니다.

###지시사항###
다음 매출 데이터를 분석하고 3가지 인사이트를 도출하세요.

###데이터###
- 1월: 5,200만원 (전년 대비 +12%)
- 2월: 4,800만원 (전년 대비 -3%)
- 3월: 6,100만원 (전년 대비 +25%)

###출력 형식###
JSON 형태로 각 인사이트를 {insight, evidence, action} 구조로 제공하세요.`,
                        explanation: 'OpenAI 6대 전략 중 전략 1(명확한 지시) + 전략 2(참조 텍스트) + 전략 3(구조화)를 조합한 프롬프트입니다.',
                        expectedOutput: '[{insight: "3월 급성장 트렌드", evidence: "+25% 증가", action: "3월 캠페인 분석하여 재적용"}, ...]'
                    }
                },
                quiz: [
                    {
                        question: 'OpenAI가 제시하는 프롬프트 엔지니어링 전략은 총 몇 가지?',
                        options: ['3가지', '4가지', '6가지', '10가지'],
                        correct: 2
                    },
                    {
                        question: '환각(Hallucination)을 줄이기 위한 OpenAI의 권장 전략은?',
                        options: [
                            '짧은 프롬프트 사용',
                            '참조 텍스트 제공',
                            '높은 Temperature 설정',
                            '영어로만 사용'
                        ],
                        correct: 1
                    },
                    {
                        question: '"단계별로 생각하세요"라는 지시는 어떤 전략에 해당하나?',
                        options: [
                            '명확한 지시',
                            '참조 텍스트',
                            'Chain-of-Thought (CoT)',
                            '외부 도구 활용'
                        ],
                        correct: 2
                    }
                ],
                practice: {
                    instruction: 'OpenAI 6대 전략을 모두 활용한 프롬프트를 작성해보세요.',
                    initialPrompt: '우리 회사의 지난 분기 고객 불만 데이터를 분석해서 개선 방안을 제시해줘',
                    hints: [
                        '역할(페르소나)을 지정하세요 — 전략 1',
                        '고객 불만 데이터를 참조 텍스트로 제공하세요 — 전략 2',
                        '분석 → 분류 → 원인 도출 → 개선안 순서로 분해하세요 — 전략 3',
                        '"단계별로 분석하세요"를 추가하세요 — 전략 4'
                    ]
                }
            }
        ]
    },

    // ========== Module 7: Anthropic Claude 공식 프롬프트 엔지니어링 가이드 ==========
    {
        id: 7,
        title: 'Anthropic Claude 공식 가이드',
        duration: '1주',
        topics: ['8단계 기법', 'XML 태그', '멀티샷', '프롬프트 체이닝'],
        lessons: [
            {
                id: '7-1',
                title: 'Claude 8단계 프롬프트 기법',
                content: {
                    theory: `
## Anthropic Claude 공식 프롬프트 엔지니어링 가이드

Anthropic은 Claude 모델의 성능을 최적화하기 위해 **8단계 기법**을 공식 문서에서 제시합니다. 효과가 큰 순서대로 정리되어 있습니다.

### 1단계: 프롬프트 생성기 (Prompt Generator)
Claude Console의 **프롬프트 생성기**로 초안을 자동 생성합니다.
- 성공 기준을 먼저 정의
- 경험적 평가 방법을 수립한 뒤
- 프롬프트 작성/개선 시작

### 2단계: 명확하고 직접적으로 (Be Clear and Direct)
Claude에게 **정확히 무엇을 원하는지** 말합니다.
- 모호한 표현 대신 구체적 지시
- "좋은 요약을 해줘" 대신 "3문장으로 핵심만 요약해줘"

### 3단계: 예시 사용 (Multishot Prompting)
**구체적 예시**를 포함하면 기대 출력 형식을 학습합니다.
- 2-3개의 입출력 쌍 제공
- 다양한 엣지 케이스 포함
- 예시의 순서와 다양성 주의

### 4단계: 생각하게 하기 (Chain of Thought)
**"단계별로 생각하세요"** — Claude가 추론 과정을 명시하면 정확도 상승.
- \`<thinking>\` 태그로 추론 공간 제공
- 복잡한 분석, 수학, 논리 문제에 특히 효과적

### 5단계: XML 태그 사용 ⭐ (Claude 특화)
Claude는 **XML 태그**를 특히 잘 이해합니다.

\`\`\`xml
<document>참조 문서 내용</document>
<instructions>구체적 지시사항</instructions>
<example>예시 출력</example>
<output>여기에 결과 작성</output>
\`\`\`

**장점:** 프롬프트 구조를 명확히 분리, 파싱이 쉬움

### 6단계: 역할 부여 (System Prompts)
**시스템 프롬프트**로 Claude의 페르소나를 설정합니다.
- "당신은 10년 경력의 UX 디자이너입니다"
- 전문 분야, 커뮤니케이션 스타일, 제약 조건 설정

### 7단계: 프롬프트 체이닝 (Chain Complex Prompts)
복잡한 작업을 **여러 프롬프트의 연쇄**로 분해합니다.
- Step 1의 출력 → Step 2의 입력
- 각 단계에서 품질 관문(gate) 설정
- 디버깅과 개선이 쉬움

### 8단계: 긴 컨텍스트 팁 (Long Context Tips)
대용량 문서 처리 시 최적화 기법:
- 핵심 지시를 **문서 앞/뒤 양쪽**에 배치
- 관련 정보를 질문 근처에 위치
- "문서에 없는 내용은 답하지 마세요" 가드레일
                    `,
                    example: {
                        prompt: `<role>당신은 법률 전문 AI 어시스턴트입니다.</role>

<document>
계약서 제3조: 납기 지연 시 일일 0.1%의 지체상금을 부과한다.
계약서 제7조: 불가항력 사유 발생 시 양 당사자는 의무가 면제된다.
</document>

<instructions>
위 계약서를 분석하여 다음 질문에 답하세요.
질문: 태풍으로 인한 3일 납기 지연의 법적 책임은?
</instructions>

<thinking>
단계별로 분석한 후 결론을 내세요.
</thinking>`,
                        explanation: 'Claude 8단계 기법 중 5단계(XML 태그) + 4단계(CoT) + 6단계(역할 부여)를 조합한 프롬프트입니다.',
                        expectedOutput: '태풍은 불가항력 사유에 해당하므로 제7조에 의거하여 의무가 면제되며, 제3조의 지체상금은 적용되지 않을 가능성이 높습니다.'
                    }
                },
                quiz: [
                    {
                        question: 'Claude가 특히 잘 이해하는 프롬프트 구조 도구는?',
                        options: ['JSON', 'XML 태그', 'YAML', 'CSV'],
                        correct: 1
                    },
                    {
                        question: 'Anthropic이 권장하는 프롬프트 기법은 총 몇 단계?',
                        options: ['4단계', '6단계', '8단계', '10단계'],
                        correct: 2
                    },
                    {
                        question: '프롬프트 체이닝의 핵심 원리는?',
                        options: [
                            '하나의 긴 프롬프트 작성',
                            '이전 출력을 다음 입력으로 연결',
                            'XML 태그만 사용',
                            '영어와 한국어 혼합'
                        ],
                        correct: 1
                    }
                ],
                practice: {
                    instruction: 'Claude의 XML 태그와 CoT를 활용한 프롬프트를 작성해보세요.',
                    initialPrompt: '다음 고객 리뷰를 분석해서 감성 분류하고 개선점을 도출해줘: "배송은 빨랐지만 포장이 엉성했어요. 제품 자체는 괜찮은데 가격이 좀 비싸네요."',
                    hints: [
                        '<review>, <instructions>, <output_format> 태그로 구조화하세요',
                        '<thinking> 태그로 분석 과정을 단계별로 진행하세요',
                        '긍정/부정/중립 각 측면을 분리하여 분석하세요'
                    ]
                }
            }
        ]
    },

    // ========== Module 8: Google Gemini 공식 프롬프트 가이드 ==========
    {
        id: 8,
        title: 'Google Gemini 공식 가이드',
        duration: '1주',
        topics: ['프롬프트 설계', '멀티모달', 'Few-shot', '구조화된 출력'],
        lessons: [
            {
                id: '8-1',
                title: 'Gemini 프롬프트 설계 전략',
                content: {
                    theory: `
## Google Gemini 공식 프롬프트 설계 전략

Google은 Gemini 모델을 위한 **체계적인 프롬프트 설계 전략**을 공식 문서에서 제시합니다.

### 프롬프트의 3요소
1. **Input (입력)**: 모델이 응답할 텍스트
   - 질문 입력 (Question Input)
   - 작업 입력 (Task Input)
   - 엔티티 입력 (Entity Input)
   - 부분 완성 입력 (Completion Input)
2. **Context (맥락)**: 배경 정보나 참조 자료
3. **Constraints (제약)**: 출력 형식, 길이, 스타일 제한

### 핵심 전략 1: 명확하고 구체적인 지시
- 하나의 프롬프트에 **하나의 작업**만 부여
- 모호한 표현 대신 **정확한 동사** 사용 (분류하세요, 요약하세요, 변환하세요)
- 출력 형식을 **명시적으로 지정** (리스트, JSON, 표 등)

### 핵심 전략 2: Few-shot 프롬프팅
입출력 **예시를 포함**하면 모델이 기대 형식을 학습합니다.

\`\`\`
질문: 코끼리의 크기는?
답변: 대형

질문: 쥐의 크기는?
답변: 소형

질문: 고양이의 크기는?
답변:
\`\`\`

### 핵심 전략 3: 부분 입력 완성
**일부를 작성하고 모델이 나머지를 완성**하도록 유도합니다.

\`\`\`
주문: 치즈버거 1개와 음료
출력: {"cheeseburger": 1, "drink": 1}

주문: 햄버거 2개, 음료, 감자튀김
출력:
\`\`\`

### 핵심 전략 4: 시스템 지시 (System Instruction)
Gemini에서 **Identity, Constraints, Output Format**을 시스템 지시로 설정합니다.

\`\`\`
Identity: 당신은 시니어 솔루션 아키텍트입니다.
Constraints:
- 외부 라이브러리 사용 금지
- Python 3.11+ 문법만 사용
Output Format: 단일 코드 블록으로 반환
\`\`\`

### 핵심 전략 5: 멀티모달 프롬프팅 ⭐ (Gemini 특화)
Gemini의 강점 — **텍스트 + 이미지 + 비디오 + 오디오** 조합 가능:
- 이미지 분석: "이 사진의 식물 상태를 진단해줘"
- 비디오 요약: "이 회의 영상의 핵심 결정사항 정리해줘"
- 오디오 전사: "이 녹음 내용을 회의록으로 변환해줘"

### 핵심 전략 6: 응답 접두사 (Response Prefix)
원하는 출력 형식의 **시작 부분을 미리 작성**하면 모델이 형식을 따라갑니다.
                    `,
                    example: {
                        prompt: `다음 스마트팜 센서 데이터를 분석하고 이상 징후를 분류하세요.

예시:
센서: 온도 35°C, 습도 40%
판단: ⚠️ 이상 - 고온 건조 (관수 및 환기 필요)

센서: 온도 25°C, 습도 65%
판단: ✅ 정상

분석할 데이터:
센서: 온도 15°C, 습도 90%
판단:`,
                        explanation: 'Gemini의 Few-shot 프롬프팅 + 부분 입력 완성 전략을 조합하여, 명확한 예시 패턴을 학습시킨 프롬프트입니다.',
                        expectedOutput: '⚠️ 이상 - 저온 과습 (난방 및 제습 필요, 곰팡이 위험)'
                    }
                },
                quiz: [
                    {
                        question: 'Gemini의 차별화된 강점은?',
                        options: [
                            'XML 태그 전문',
                            '멀티모달 (텍스트+이미지+비디오+오디오)',
                            '코드 전용 모델',
                            '오프라인 실행'
                        ],
                        correct: 1
                    },
                    {
                        question: 'Google이 권장하는 프롬프트의 3요소가 아닌 것은?',
                        options: ['Input', 'Context', 'Constraints', 'Temperature'],
                        correct: 3
                    },
                    {
                        question: '"부분 입력 완성" 기법의 핵심은?',
                        options: [
                            '전체 문장을 작성하기',
                            '일부를 작성하고 모델이 나머지를 완성',
                            'XML 태그 사용하기',
                            '이미지를 첨부하기'
                        ],
                        correct: 1
                    }
                ],
                practice: {
                    instruction: 'Gemini의 Few-shot + 시스템 지시 전략으로 프롬프트를 작성하세요.',
                    initialPrompt: '이메일을 긴급도별로 분류해줘:\n\n이메일 1: "서버 다운 - 즉시 대응 필요"\n이메일 2: "다음 주 미팅 일정 조율"\n이메일 3: "월간 뉴스레터"',
                    hints: [
                        'Identity로 역할을 먼저 설정하세요',
                        '긴급/보통/낮음의 분류 예시를 2-3개 제공하세요',
                        '출력 형식을 JSON이나 표로 지정하세요'
                    ]
                }
            }
        ]
    },

    // ========== Module 9: Meta Llama 공식 프롬프트 가이드 ==========
    {
        id: 9,
        title: 'Meta Llama 공식 가이드',
        duration: '1주',
        topics: ['시스템 프롬프트', 'Zero/Few-shot', '작업 분해', '오픈소스 활용'],
        lessons: [
            {
                id: '9-1',
                title: 'Llama 프롬프트 최적화',
                content: {
                    theory: `
## Meta Llama 공식 프롬프트 엔지니어링 가이드

Meta는 Llama 3.x 모델을 위한 **프롬프트 최적화 기법**을 공식으로 제시합니다. 오픈소스 모델의 특성을 활용한 전략이 특징입니다.

### 특징: 오픈소스 AI 모델
- **무료 사용**: 상용 목적 포함 자유 사용 가능
- **로컬 실행**: 기업 데이터가 외부로 나가지 않음
- **커스터마이징**: 파인튜닝, LoRA 등으로 맞춤화 가능
- **모델 라인업**: Llama 3.3 (70B), Llama 3.2 (1B/3B/11B/90B)

### 전략 1: 시스템 프롬프트 설계
Llama는 **시스템 프롬프트에 매우 민감**합니다. 정확한 포맷이 중요합니다.

\`\`\`
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

당신은 스마트팜 전문 AI 어시스턴트입니다.
한국어로 답변하고, 모든 수치에 단위를 포함하세요.
불확실한 정보에는 "확인 필요"를 명시하세요.

<|eot_id|><|start_header_id|>user<|end_header_id|>
\`\`\`

### 전략 2: Zero-shot vs Few-shot
- **Zero-shot**: 예시 없이 지시만 제공 (간단한 작업)
- **Few-shot**: 2-5개 예시 포함 (복잡한 형식, 분류 작업)
- **One-shot**: 1개 예시 (기본 형식 학습)

### 전략 3: 작업 분해 (Task Decomposition)
복잡한 작업을 **단계적 하위 작업**으로 분해합니다.
- "먼저 A를 수행하고, 그 결과를 바탕으로 B를 진행하세요"
- 각 단계의 출력 형식을 명시

### 전략 4: Chain-of-Thought (CoT)
**"단계별로 추론하세요"** 지시로 정확도를 높입니다.
- 수학, 논리, 분석 작업에 특히 효과적
- "Let's think step by step" 대신 한국어로 명시 가능

### 전략 5: 구조화된 출력 요청
Llama에게 정확한 **출력 포맷**을 지시합니다.
- JSON, Markdown 표, 번호 목록 등
- 출력 스키마를 미리 정의하면 파싱이 쉬움

### 전략 6: 가드레일 설정
오픈소스 모델이므로 **안전 가드레일**이 중요합니다.
- **Llama Guard**: 안전성 분류 모델
- 시스템 프롬프트에 금지 사항 명시
- "~에 대해서는 답하지 마세요" 명시적 제한

### 💡 Llama vs 상용 모델 비교

| 항목 | Llama | GPT/Claude |
|------|-------|------------|
| 비용 | 무료 (호스팅 비용만) | API 과금 |
| 데이터 프라이버시 | ✅ 로컬 실행 가능 | ❌ 외부 API |
| 커스터마이징 | ✅ 파인튜닝 가능 | ❌ 제한적 |
| 성능 | 중상급 | 최상급 |
| 설치/운영 | 복잡 | 간편 |
                    `,
                    example: {
                        prompt: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>

당신은 스마트팜 IoT 데이터 분석 전문가입니다.
센서 데이터를 분석하고 JSON 형식으로 결과를 제공하세요.
불확실한 경우 confidence_score를 0.5 이하로 설정하세요.

<|eot_id|><|start_header_id|>user<|end_header_id|>

다음 센서 데이터를 분석하고 이상 징후를 판별해줘:
- 온도: 38°C (정상 범위: 20-30°C)
- 습도: 25% (정상 범위: 50-70%)
- CO2: 1200ppm (정상 범위: 400-800ppm)

<|eot_id|><|start_header_id|>assistant<|end_header_id|>`,
                        explanation: 'Llama의 특수 토큰 형식 + 시스템 프롬프트 + 구조화된 출력 요청을 조합한 프롬프트입니다.',
                        expectedOutput: '{"anomalies": [{"sensor": "temperature", "status": "critical_high", "action": "즉시 환기 가동"}], "confidence_score": 0.95}'
                    }
                },
                quiz: [
                    {
                        question: 'Llama 모델의 가장 큰 특징은?',
                        options: [
                            '가장 빠른 응답 속도',
                            '오픈소스 & 로컬 실행 가능',
                            'XML 태그 전문',
                            '멀티모달 전용'
                        ],
                        correct: 1
                    },
                    {
                        question: 'Llama의 시스템 프롬프트 시작 토큰은?',
                        options: [
                            '<system>',
                            '[SYSTEM]',
                            '<|start_header_id|>system<|end_header_id|>',
                            '##system##'
                        ],
                        correct: 2
                    },
                    {
                        question: 'Llama Guard의 역할은?',
                        options: [
                            '코드 실행 환경',
                            'AI 안전성 분류 모델',
                            '벡터 데이터베이스',
                            '모델 경량화 도구'
                        ],
                        correct: 1
                    }
                ],
                practice: {
                    instruction: 'Llama 스타일의 시스템 프롬프트 + Few-shot 프롬프트를 작성해보세요.',
                    initialPrompt: '고객 문의를 유형별로 분류하고 우선순위를 매겨줘:\n\n문의 1: "결제가 안 돼요, 급해요!"\n문의 2: "배송 예정일이 궁금합니다"\n문의 3: "앱이 자꾸 크래시 나요"',
                    hints: [
                        'Llama 특수 토큰으로 시스템/유저/어시스턴트 역할을 구분하세요',
                        'Few-shot 예시를 1-2개 먼저 제공하세요',
                        '출력 형식을 JSON으로 지정하면 파싱이 쉽습니다',
                        'Llama Guard 스타일로 안전성 가드레일을 추가해보세요'
                    ]
                }
            }
        ]
    },

    // ========== Module 10: 2026 최신 AI 기술 ==========
    {
        id: 10,
        title: '2026 최신 AI 기술',
        duration: '2주',
        topics: ['Context Engineering', 'Prompt Caching', 'Agentic AI', 'Structured Output', 'Self-Evolving Prompts'],
        lessons: [
            {
                id: '10-1',
                title: 'Context Engineering & Prompt Caching',
                content: {
                    theory: `
## Context Engineering이란?

2025년 Anthropic이 제안한 새로운 패러다임: "프롬프트 엔지니어링"을 넘어 **"컨텍스트 엔지니어링"**으로 진화.

> "Context is the lifeblood of useful agents" — Anthropic, 2025

### 핵심 개념

#### 1. JIT (Just-in-Time) Context Loading
필요한 컨텍스트만 **런타임에 동적으로 로드**하는 기법:
- 전체 문서 대신 관련 섹션만 주입
- Token budget을 효율적으로 사용
- Relevance Score 기반 우선순위 결정

#### 2. Attention Budget 최적화
LLM의 **유한한 attention 자원**을 최적 분배:
- 고신호(High-signal) 토큰 추출
- 잡음(noise) 제거로 attention 집중도 향상
- 컨텍스트 위치별 영향도 분석

#### 3. Context 우선순위 체계
\`\`\`
[System Instructions] → 최고 우선순위
[Critical Context]   → 핵심 정보
[Supporting Data]    → 보조 정보  
[Examples]           → 학습용 예시
\`\`\`

---

## Prompt Caching

2025년 주요 AI 기업이 도입한 **지능형 프롬프트 캐싱**:

### 효과
- 💰 **최대 50% 비용 절감**
- ⚡ **10x 레이턴시 감소**

### Static-First 전략
프롬프트를 **정적/동적** 부분으로 분리:

\`\`\`
[STATIC] 시스템 프롬프트 + 고정 컨텍스트  → 캐시 대상
[DYNAMIC] 사용자 질문 + 가변 데이터        → 매번 새로 처리
\`\`\`

### 캐시 구조 설계
1. **프롬프트 파싱**: 섹션별 분리 (system, context, examples, query)
2. **캐시 키 생성**: 정적 섹션 해시 → 캐시 키
3. **히트/미스 통계**: 캐시 효율 모니터링
4. **비용 절감 계산**: 캐시된 토큰 × 모델 단가
                    `,
                    example: {
                        prompt: '당신은 스마트팜 IoT 전문가입니다.\n\n[STATIC CONTEXT]\n스마트팜 온도 기준: 토마토 25-28°C, 딸기 18-22°C, 상추 15-20°C\n\n[DYNAMIC QUERY]\n현재 온실 온도 32°C, 재배 작물: 딸기. 대응 방안을 제시하세요.',
                        explanation: 'Static-First 전략 적용: 작물별 기준값은 캐시에 저장, 실시간 쿼리만 동적 처리. 반복 호출 시 50% 비용 절감.',
                        expectedOutput: '32°C는 딸기 적정 온도(18-22°C)를 10°C 초과. 즉시 환기 + 쿨링 시스템 가동 필요.'
                    }
                },
                quiz: [
                    {
                        question: '"Context is the lifeblood of useful agents"는 어느 기업의 관점인가?',
                        options: ['OpenAI', 'Google', 'Anthropic', 'Meta'],
                        correct: 2
                    },
                    {
                        question: 'JIT Context Loading의 핵심 원리는?',
                        options: [
                            '모든 컨텍스트를 한 번에 로드',
                            '필요한 컨텍스트만 런타임에 동적 로드',
                            '컨텍스트 없이 추론',
                            '영어 컨텍스트만 지원'
                        ],
                        correct: 1
                    },
                    {
                        question: 'Prompt Caching의 주요 이점이 아닌 것은?',
                        options: [
                            '최대 50% 비용 절감',
                            '10x 레이턴시 감소',
                            '모델 정확도 100% 보장',
                            '동일 컨텍스트 재사용'
                        ],
                        correct: 2
                    },
                    {
                        question: 'Static-First 전략에서 캐시 대상은?',
                        options: [
                            '사용자의 실시간 질문',
                            '시스템 프롬프트 + 고정 컨텍스트',
                            'AI 모델의 응답',
                            '모든 데이터'
                        ],
                        correct: 1
                    }
                ],
                practice: {
                    instruction: 'Prompt Caching의 Static-First 전략을 직접 설계해보세요. 아래 프롬프트에서 정적/동적 부분을 분리하세요.',
                    initialPrompt: '당신은 금융 분석 전문가입니다.\n\n분석 기준:\n- ROE > 15%: 우수\n- PER < 10: 저평가\n- 부채비율 < 100%: 안정적\n\n다음 기업을 분석하세요:\n기업명: 삼성전자\nROE: 18%, PER: 8.5, 부채비율: 45%',
                    hints: [
                        '시스템 역할과 분석 기준은 정적(STATIC) 섹션입니다',
                        '기업별 데이터는 동적(DYNAMIC) 섹션입니다',
                        '[STATIC]과 [DYNAMIC] 태그로 구분하세요',
                        '100번 호출 시 정적 부분 캐시 효과를 계산해보세요'
                    ]
                }
            },
            {
                id: '10-2',
                title: 'Agentic AI & Structured Output',
                content: {
                    theory: `
## Agentic AI (에이전틱 AI)

> "By 2028, 33% of enterprise apps will include agentic AI" — Gartner, 2025

### ReAct+ 패턴 (Reason → Act → Critique)

기존 ReAct 패턴에 **자기 비판(Self-Critique)** 단계를 추가한 고도화 프레임워크:

\`\`\`
Step 1: 🧠 THINK   — 작업 분석 및 전략 수립
Step 2: 🎯 ACT     — 도구 선택 및 실행
Step 3: 👁️ OBSERVE — 실행 결과 관찰
Step 4: 🔍 CRITIQUE — 자기 검증 및 품질 평가
Step 5: 🔄 ADJUST  — 전략 조정 (필요 시 재시도)
\`\`\`

### Multi-Agent 시스템

복수의 AI 에이전트가 **역할 분담** 후 **협업**:

| 에이전트 | 역할 | 전문성 |
|---------|------|--------|
| Researcher | 정보 수집 | 검색, 데이터 분석 |
| Analyst | 분석 수행 | 통계, 패턴 인식 |
| Writer | 보고서 작성 | 문서화, 커뮤니케이션 |
| Reviewer | 품질 검증 | 팩트체크, 일관성 |

### 실무 활용

- **자동화 파이프라인**: 데이터 수집 → 분석 → 보고서 → 검증
- **의사결정 지원**: Multi-Agent 합의 기반 추천
- **복잡한 문제 해결**: 작업 분해 → 병렬 처리 → 결과 통합

---

## Structured Output (구조화된 출력)

### JSON Schema 기반 출력 강제

AI의 응답을 **미리 정의된 구조**로 강제하는 기법:

\`\`\`json
{
  "type": "object",
  "properties": {
    "summary": { "type": "string", "maxLength": 200 },
    "sentiment": { "type": "string", "enum": ["positive", "negative", "neutral"] },
    "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
    "key_points": { "type": "array", "items": { "type": "string" } }
  },
  "required": ["summary", "sentiment", "confidence"]
}
\`\`\`

### 검증 체계
1. **스키마 정의**: JSON Schema로 기대 구조 명시
2. **프롬프트 주입**: 스키마를 프롬프트에 포함
3. **출력 파싱**: JSON.parse로 구조화된 응답 추출
4. **유효성 검증**: 타입, 범위, 필수 필드 체크
5. **에러 처리**: 파싱 실패 시 재시도 로직
                    `,
                    example: {
                        prompt: '다음 작업을 ReAct+ 패턴으로 수행하세요:\n\n작업: "2026년 한국 AI 시장 동향 분석"\n\n🧠 THINK: 먼저 분석 전략을 수립하세요\n🎯 ACT: 핵심 키워드 기반으로 분석 수행\n👁️ OBSERVE: 결과 관찰\n🔍 CRITIQUE: 분석의 편향이나 누락 검토\n\n출력 형식:\n```json\n{"analysis": "...", "confidence": 0.0, "sources_needed": []}',
                        explanation: 'ReAct+ 패턴의 5단계를 명시적으로 지시하여 AI가 체계적으로 추론하도록 유도합니다.',
                        expectedOutput: '{"analysis": "AI 에이전트 도입 가속화, LLM 비용 90% 절감...", "confidence": 0.75, "sources_needed": ["정부 AI 정책", "시장 보고서"]}'
                    }
                },
                quiz: [
                    {
                        question: 'ReAct+ 패턴에서 기존 ReAct에 추가된 단계는?',
                        options: ['Plan', 'Self-Critique', 'Summarize', 'Translate'],
                        correct: 1
                    },
                    {
                        question: 'Multi-Agent 시스템의 핵심 이점은?',
                        options: [
                            '하나의 AI가 모든 작업 수행',
                            '역할 분담과 전문성 기반 협업',
                            'GPU 사용량 최소화',
                            '인터넷 연결 불필요'
                        ],
                        correct: 1
                    },
                    {
                        question: 'Structured Output에서 JSON Schema의 역할은?',
                        options: [
                            'AI 학습 데이터 제공',
                            '출력 형식을 미리 정의하고 강제',
                            'UI 디자인 설정',
                            '비용 계산'
                        ],
                        correct: 1
                    },
                    {
                        question: 'Gartner가 예측한 2028년 Enterprise AI Agent 도입률은?',
                        options: ['10%', '25%', '33%', '50%'],
                        correct: 2
                    }
                ],
                practice: {
                    instruction: 'Multi-Agent 시스템을 설계하는 프롬프트를 작성해보세요. 3개 이상의 에이전트 역할을 정의하세요.',
                    initialPrompt: '프로젝트: 신제품 출시 기획서 작성\n\n에이전트 역할을 정의하고, 각 에이전트가 ReAct+ 패턴으로 협업하는 과정을 설계하세요.',
                    hints: [
                        '에이전트별 전문 역할을 정의하세요 (시장분석, 기획, 검토 등)',
                        'ReAct+ 패턴의 5단계를 각 에이전트에 적용하세요',
                        '에이전트 간 정보 전달 흐름을 설계하세요',
                        '출력 형식을 JSON Schema로 정의하여 자동화를 고려하세요'
                    ]
                }
            },
            {
                id: '10-3',
                title: 'Self-Evolving Prompts & Meta-Prompting',
                content: {
                    theory: `
## Self-Evolving Prompts (자기 진화 프롬프트)

2026년의 혁신: 프롬프트가 **스스로 개선되는 시스템**.

### 핵심 원리

피드백 기반 **자동 프롬프트 개선** 루프:

\`\`\`
1. 초기 프롬프트 실행
2. 결과 품질 평가 (정확도, 완성도, 관련성)
3. 약점 분석 (무엇이 부족한가?)
4. 개선 전략 결정
5. 프롬프트 변형(Mutation) 적용
6. 재실행 및 비교
\`\`\`

### 변형(Mutation) 전략

| 전략 | 설명 | 예시 |
|------|------|------|
| add_structure | 구조 추가 | 자유형 → 번호/섹션 구분 |
| add_examples | 예시 추가 | Zero-shot → Few-shot |
| compress | 압축 | 불필요 표현 제거, 토큰 절감 |
| add_constraints | 제약 추가 | 출력 형식, 길이, 스타일 명시 |
| refine_role | 역할 정밀화 | 일반 → 특정 전문가 |

### 성능 추적

\`\`\`
Version 1: accuracy=0.65, tokens=500
Version 2: accuracy=0.78, tokens=420 (+compress)
Version 3: accuracy=0.89, tokens=380 (+add_structure)
Version 4: accuracy=0.92, tokens=350 (+add_constraints) ← 최적
\`\`\`

---

## Meta-Prompting

**프롬프트가 프롬프트를 생성**하는 고급 기법.

### 개념

기존: 사람이 프롬프트 작성
Meta: AI에게 **"이 작업에 가장 적합한 프롬프트를 설계해줘"** 요청

### Meta-Prompt 구조

\`\`\`
당신은 프롬프트 엔지니어링 전문가입니다.

다음 작업에 대한 최적의 프롬프트를 설계해주세요:
- 작업: {task_description}  
- 목표: {goal}
- 제약조건: {constraints}
- 사용 모델: {model}

프롬프트에 포함해야 할 요소:
1. 역할 정의
2. 컨텍스트
3. 구체적 지시사항
4. 출력 형식
5. 예시 (최소 2개)
6. 품질 가드레일
\`\`\`

### A/B 테스트 기반 최적화

1. Meta-Prompt로 **후보 프롬프트 3-5개 생성**
2. 동일한 테스트 케이스에 **각각 실행**
3. 결과를 **정량 비교** (정확도, 완성도, 일관성)
4. 최고 성능 프롬프트를 **선택 및 배포**
5. 지속적 피드백으로 **반복 개선**
                    `,
                    example: {
                        prompt: '당신은 프롬프트 엔지니어링 전문가입니다.\n\n다음 작업에 대한 최적의 프롬프트를 설계해주세요:\n- 작업: 고객 리뷰 감성 분석 및 제품 개선점 도출\n- 목표: 분류 정확도 90% 이상, 실행 가능한 개선안 3가지\n- 제약조건: 한국어, JSON 출력, 500 토큰 이내\n- 사용 모델: GPT-4o\n\n설계한 프롬프트에 역할, 컨텍스트, 지시사항, 출력 형식, 예시를 포함하세요.',
                        explanation: 'Meta-Prompting 기법: AI에게 직접 작업을 수행시키는 대신, "최적의 프롬프트를 설계해달라"고 요청합니다. 이렇게 생성된 프롬프트는 더 체계적이고 성능이 높습니다.',
                        expectedOutput: '역할 정의 + XML 구조화 + Few-shot 예시 + JSON Schema 출력 형식이 포함된 전문 프롬프트가 생성됩니다.'
                    }
                },
                quiz: [
                    {
                        question: 'Self-Evolving Prompts의 핵심 원리는?',
                        options: [
                            '프롬프트를 절대 변경하지 않음',
                            '피드백 기반 자동 프롬프트 개선',
                            'AI 모델 자체를 변경',
                            '오직 영어로만 프롬프트 작성'
                        ],
                        correct: 1
                    },
                    {
                        question: 'Meta-Prompting이란?',
                        options: [
                            '메타데이터를 분석하는 기법',
                            '프롬프트가 프롬프트를 생성하는 기법',
                            '메타버스에서 AI를 사용하는 기법',
                            'AI 모델을 학습하는 기법'
                        ],
                        correct: 1
                    },
                    {
                        question: 'Mutation 전략 중 "compress"의 목적은?',
                        options: [
                            '프롬프트 길이 증가',
                            '불필요 표현 제거, 토큰 절감',
                            '이미지 압축',
                            '데이터베이스 최적화'
                        ],
                        correct: 1
                    },
                    {
                        question: 'A/B 테스트 기반 최적화의 첫 번째 단계는?',
                        options: [
                            '프롬프트 배포',
                            '후보 프롬프트 여러 개 생성',
                            '비용 계산',
                            'UI 디자인'
                        ],
                        correct: 1
                    }
                ],
                practice: {
                    instruction: 'Meta-Prompting을 직접 실습해보세요. AI에게 최적의 프롬프트를 설계하도록 요청하세요.',
                    initialPrompt: '당신은 프롬프트 엔지니어링 전문가입니다.\n\n다음 작업에 대한 최적의 프롬프트를 설계해주세요:\n- 작업: [여기에 원하는 작업을 입력하세요]\n- 목표: [달성하고 싶은 목표]\n- 제약조건: 한국어, 500 토큰 이내',
                    hints: [
                        '작업을 구체적으로 정의하세요 (예: 이메일 분류, 보고서 요약 등)',
                        '목표에 정량적 기준을 포함하세요 (정확도, 개수 등)',
                        '설계된 프롬프트에 역할, 예시, 출력 형식이 포함되어야 합니다',
                        '생성된 프롬프트를 실제로 실행하고 결과를 비교해보세요'
                    ]
                }
            }
        ]
    }
];

export default extendedCurriculum;
