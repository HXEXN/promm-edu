// Comprehensive prompt templates for various use cases
export const promptTemplates = {
    coding: {
        name: '코딩 & 개발',
        icon: '💻',
        templates: [
            {
                id: 'code-review',
                title: '코드 리뷰',
                description: '코드의 품질, 버그, 개선점을 분석',
                template: `You are an expert code reviewer with 15+ years of experience in software development.

Context: The user needs a thorough code review focusing on:
- Code quality and best practices
- Potential bugs and edge cases
- Performance optimizations
- Security vulnerabilities
- Readability and maintainability

Task: Review the following code and provide:
1. Overall assessment (score out of 10)
2. Specific issues found (with line numbers)
3. Suggested improvements with code examples
4. Best practices recommendations

Code language: {language}
Code to review:
{code}

Format your response with clear sections and code blocks.`
            },
            {
                id: 'code-generation',
                title: '코드 생성',
                description: '요구사항에 맞는 코드 작성',
                template: `You are an expert {language} developer with deep knowledge of design patterns and best practices.

Context: Write production-ready code that:
- Follows {language} best practices and style guide
- Includes comprehensive error handling
- Uses type hints/annotations where applicable
- Has clear documentation and comments
- Is modular and maintainable

Task: Generate {language} code for the following requirement:
{requirement}

Requirements:
- Use descriptive variable and function names
- Include docstrings/JSDoc
- Add inline comments for complex logic
- Consider edge cases
- Make it production-ready

Provide:
1. Complete code implementation
2. Usage example
3. Brief explanation of key design decisions`
            },
            {
                id: 'debug-help',
                title: '디버깅 도움',
                description: '에러 원인 분석 및 해결 방법',
                template: `You are an expert debugger with extensive experience in {language} and common frameworks.

Context: Help identify and fix the following error/bug.

Error details:
{error}

Code context:
{code}

Task: Provide a comprehensive debugging solution:
1. Root cause analysis
2. Step-by-step fix
3. Explanation of why it happened
4. How to prevent similar issues
5. Related best practices

Be specific with code examples and line numbers.`
            }
        ]
    },
    writing: {
        name: '글쓰기 & 콘텐츠',
        icon: '✍️',
        templates: [
            {
                id: 'blog-post',
                title: '블로그 포스트',
                description: 'SEO 최적화된 블로그 글',
                template: `You are a professional content writer and SEO specialist.

Context: Write an engaging, SEO-optimized blog post on the following topic:
{topic}

Target audience: {audience}
Desired tone: {tone}
Word count: {wordCount}

Requirements:
- Compelling headline (under 60 characters)
- Meta description (150-160 characters)
- Introduction hook
- Well-structured body with H2/H3 headings
- Practical examples or case studies
- Actionable takeaways
- Strong conclusion with CTA

SEO requirements:
- Natural keyword integration
- Internal linking suggestions
- Image alt text recommendations

Provide the complete blog post with clear section markers.`
            },
            {
                id: 'email-marketing',
                title: '마케팅 이메일',
                description: '전환율 높은 이메일 작성',
                template: `You are an expert email marketing copywriter with proven track record in conversion optimization.

Context: Write a high-converting marketing email for:
Campaign goal: {goal}
Target audience: {audience}
Product/Service: {product}

Requirements:
- Attention-grabbing subject line (A/B test options)
- Personalized opening
- Clear value proposition
- Social proof or testimonials
- Strong CTA
- P.S. for urgency/scarcity

Tone: {tone}

Provide:
1. 3 subject line options
2. Complete email body
3. CTA button text options
4. Brief rationale for key choices`
            },
            {
                id: 'social-media',
                title: '소셜 미디어',
                description: '플랫폼별 최적화된 게시물',
                template: `You are a social media expert specializing in {platform}.

Context: Create an engaging {platform} post about:
{topic}

Platform: {platform}
Goal: {goal}
Audience: {audience}

{platform}-specific requirements:
- Optimal length and format
- Hashtag strategy (relevant and trending)
- Engaging hook in first line
- Clear call-to-action
- Visual content suggestions

Provide:
1. Post copy
2. 5-10 relevant hashtags
3. Best posting time suggestion
4. Engagement tactics`
            }
        ]
    },
    business: {
        name: '비즈니스 & 분석',
        icon: '📊',
        templates: [
            {
                id: 'market-analysis',
                title: '시장 분석',
                description: '산업/시장 트렌드 분석',
                template: `You are a senior business analyst and market research expert.

Context: Conduct a comprehensive market analysis for:
Industry: {industry}
Geographic focus: {region}
Time frame: {timeframe}

Analysis requirements:
1. Market size and growth trends
2. Key players and competitive landscape
3. Customer segments and behaviors
4. Emerging trends and opportunities
5. Threats and challenges
6. SWOT analysis
7. Actionable recommendations

Provide data-driven insights with specific examples and cite reliable sources where possible.`
            },
            {
                id: 'business-plan',
                title: '비즈니스 플랜',
                description: '사업 계획서 작성',
                template: `You are an experienced business consultant and venture capitalist.

Context: Create a professional business plan for:
Business idea: {idea}
Industry: {industry}
Target market: {market}

Business plan sections:
1. Executive Summary
2. Company Description
3. Market Analysis
4. Organization & Management
5. Product/Service Line
6. Marketing & Sales Strategy
7. Financial Projections
8. Funding Requirements

Make it investor-ready with specific, quantifiable goals and realistic projections.`
            },
            {
                id: 'competitive-analysis',
                title: '경쟁사 분석',
                description: '경쟁사 전략 분석',
                template: `You are a competitive intelligence analyst.

Context: Analyze the following competitor:
Competitor: {competitor}
Our product: {ourProduct}
Industry: {industry}

Analysis framework:
1. Product/service comparison
2. Pricing strategy
3. Marketing approach
4. Strengths and weaknesses
5. Market positioning
6. Customer reviews and sentiment
7. Opportunities to differentiate

Provide actionable insights to gain competitive advantage.`
            }
        ]
    },
    education: {
        name: '교육 & 학습',
        icon: '🎓',
        templates: [
            {
                id: 'lesson-plan',
                title: '수업 계획',
                description: '효과적인 수업 설계',
                template: `You are an experienced educator and curriculum designer.

Context: Create a comprehensive lesson plan for:
Subject: {subject}
Grade level: {gradeLevel}
Duration: {duration}
Learning objectives: {objectives}

Lesson plan components:
1. Learning objectives (specific, measurable)
2. Materials needed
3. Warm-up activity (5-10 min)
4. Main instruction (step-by-step)
5. Guided practice
6. Independent practice
7. Assessment methods
8. Differentiation strategies
9. Homework/extension activities

Make it engaging and aligned with educational standards.`
            },
            {
                id: 'explainer',
                title: '개념 설명',
                description: '복잡한 개념을 쉽게 설명',
                template: `You are an expert educator skilled at making complex topics accessible.

Context: Explain the following concept to {audience}:
Concept: {concept}
Current knowledge level: {level}

Teaching approach:
1. Simple definition (ELI5 style)
2. Real-world analogy
3. Detailed explanation with examples
4. Common misconceptions
5. Practice questions
6. Further learning resources

Use the Feynman Technique: explain as if teaching a beginner, using simple language and concrete examples.`
            },
            {
                id: 'quiz-generator',
                title: '퀴즈 생성',
                description: '학습 평가용 퀴즈',
                template: `You are an assessment design expert.

Context: Create a comprehensive quiz for:
Topic: {topic}
Difficulty: {difficulty}
Question count: {count}

Quiz requirements:
- Multiple choice (4 options each)
- True/False
- Short answer
- Mix of knowledge levels (Bloom's Taxonomy)
- Clear, unambiguous questions
- Detailed answer key with explanations

Format:
- Question text
- Answer options (for MC)
- Correct answer
- Explanation/rationale`
            }
        ]
    },
    creative: {
        name: '창작 & 스토리',
        icon: '🎨',
        templates: [
            {
                id: 'story-writing',
                title: '스토리 작성',
                description: '창의적인 이야기 만들기',
                template: `You are a creative fiction writer with published works.

Context: Write an engaging story with:
Genre: {genre}
Setting: {setting}
Main character: {character}
Theme: {theme}
Length: {length}

Story elements:
- Compelling opening hook
- Well-developed characters
- Clear plot structure (setup, conflict, resolution)
- Vivid descriptions
- Engaging dialogue
- Emotional depth
- Satisfying conclusion

Writing style: {style}

Provide the complete story with proper formatting and pacing.`
            },
            {
                id: 'brainstorming',
                title: '아이디어 브레인스토밍',
                description: '창의적 아이디어 생성',
                template: `You are an innovation consultant and creative thinking expert.

Context: Generate creative ideas for:
Challenge/Goal: {challenge}
Constraints: {constraints}
Target audience: {audience}

Brainstorming approach:
1. Problem reframing (3 different angles)
2. 10 diverse ideas (wild ideas encouraged)
3. Combination and synthesis
4. Top 3 ideas with detailed development
5. Implementation considerations

Use creative thinking techniques:
- SCAMPER method
- Random word association
- Reverse thinking
- Analogies from other industries`
            },
            {
                id: 'video-script',
                title: '영상 스크립트',
                description: 'YouTube/광고 영상 대본',
                template: `You are a professional video scriptwriter and content strategist.

Context: Write a compelling video script for:
Video type: {videoType}
Topic: {topic}
Duration: {duration}
Platform: {platform}
Audience: {audience}

Script elements:
- Attention-grabbing hook (first 5 seconds)
- Clear structure with timestamps
- Engaging narration
- Visual cues and B-roll suggestions
- Call-to-action
- YouTube SEO elements (title, description, tags)

Include:
[VISUAL] cues
[AUDIO] cues
[TEXT OVERLAY] suggestions

Make it optimized for viewer retention.`
            }
        ]
    }
};

export const getTemplateById = (category, templateId) => {
    return promptTemplates[category]?.templates?.find(t => t.id === templateId);
};

export const getAllCategories = () => {
    return Object.keys(promptTemplates).map(key => ({
        id: key,
        ...promptTemplates[key]
    }));
};

export const fillTemplate = (template, variables) => {
    let filled = template;
    Object.keys(variables).forEach(key => {
        const regex = new RegExp(`\\{${key}\\}`, 'g');
        filled = filled.replace(regex, variables[key] || `[${key}]`);
    });
    return filled;
};
