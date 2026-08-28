import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { TravelData, TravelCard } from '../src/types';

let aiInstance: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set in environment. Using fallback mode.');
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey || 'dummy-key',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

export async function generateInitialScript(travelData: TravelData, displayName: string): Promise<string[]> {
  const dest = travelData.customDestination || travelData.destination || '제주도';
  const purpose = travelData.customPurpose || travelData.purpose || '맛있는 음식 먹기';
  const companion = travelData.customCompanion || travelData.companion || '친구';
  const duration = travelData.duration || '2박 3일';
  const budget = travelData.budget || '30~50만원';
  const mustDo = travelData.mustDo || '명소 방문하기';
  const mustHave = travelData.mustHave || '편한 신발';
  const reason = travelData.reason || '좋은 추억을 쌓고 싶어서';

  const systemInstruction = `당신은 한국 중학교 국어/진로 수업의 '나의 꿈의 여행' 발표 도우미입니다.
학생들이 발표할 수 있는 자연스럽고 또박또박한 한국어 발표문을 작성해야 합니다.

[작성 지침]
1. 발표 대상: 한국 중학교 같은 반 친구들과 선생님
2. 발표 분량: 소리 내어 읽었을 때 약 1분~1분 30초 (한국어 250~350자 내외)
3. 어투: 정중하고 활기찬 중학생 발표 어투 (~합니다, ~습니다, ~해요)
4. 문장 구성: 4개~7개의 명확하고 간결한 개별 문장으로 나누어 배열(JSON Array of Strings)
5. 필수 포함 내용:
   - 인사 및 자기소개/발표 주제 소개
   - 여행지 및 함께 갈 동행자
   - 여행 기간 및 주요 목적/테마
   - 꼭 하고 싶은 핵심 활동 및 필수 준비물/예산
   - 이 여행을 가고 싶은 이유 및 마무리 인사
6. 절대적 규칙:
   - 모든 내용은 한국어로만 작성해야 합니다.
   - 지나치게 어렵거나 생소한 어휘는 피하고 중학생 눈높이에 맞추세요.
   - 학생이 제공하지 않은 가짜 구체적 사실(정확한 비행기 편명, 상호명, 가격 등)을 지어내지 마세요.
   - 응답은 반드시 JSON 문자열 배열 형태(예: ["문장1", "문장2", ...])로 반환하세요.`;

  const prompt = `학생 이름: ${displayName}
[여행 계획 정보]
- 여행지: ${dest}
- 주요 목적/테마: ${purpose}
- 함께 갈 사람: ${companion}
- 여행 기간: ${duration}
- 예상 예산: ${budget}
- 꼭 하고 싶은 것: ${mustDo}
- 꼭 필요한 준비물: ${mustHave}
- 여행을 가고 싶은 이유: ${reason}

위 내용을 바탕으로 학생이 발표할 완성도 높은 4~7개 문장으로 구성된 발표문 배열을 생성해 주세요.`;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.MINIMAL,
        },
      },
    });

    const text = response.text?.trim() || '[]';
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((s: string) => s.trim()).filter((s: string) => s.length > 0);
    }
  } catch (err) {
    console.error('Error in generateInitialScript with Gemini:', err);
  }

  // Fallback if AI fails or key is missing
  return [
    `안녕하세요, 저는 오늘 저의 꿈의 여행에 대해 발표할 ${displayName}입니다.`,
    `제가 가장 가고 싶은 여행지는 바로 ${dest}이며, ${companion}와(과) 함께 ${duration} 일정으로 떠나고 싶습니다.`,
    `이번 여행의 가장 큰 목적은 ${purpose}이며, 특히 ${mustDo}을(를) 꼭 해보고 싶습니다.`,
    `여행을 위해 꼭 챙겨야 할 것은 ${mustHave}이고, 예상 경비는 ${budget} 정도로 생각하고 있습니다.`,
    `제가 이 여행을 꿈꾸는 이유는 ${reason} 때문입니다.`,
    `친구들과 함께 멋진 추억을 만들 수 있는 이 여행이 정말 기대됩니다. 들어주셔서 감사합니다.`,
  ];
}

export async function reviseSentence(
  currentSentences: string[],
  sentenceIndex: number,
  studentRequest: string
): Promise<string> {
  const originalSentence = currentSentences[sentenceIndex] || '';

  const systemInstruction = `당신은 한국 중학교 '나의 꿈의 여행' 발표문 수정 전문 AI 교사입니다.
학생이 전체 발표문 중에서 특정한 한 문장을 지정하여 수정을 요청했습니다.

[핵심 규칙 - 절대 준수]
1. 반드시 선택된 [대상 문장] 하나만 학생의 [수정 요청]에 맞춰 새롭게 한국어로 다시 작성하세요.
2. 다른 문장들은 건드리지 않으며, 전체 발표의 맥락과 자연스럽게 이어지도록 어조와 연결성을 유지하세요.
3. 중학생 발표에 어울리는 정중하고 또박또박한 말투(~합니다, ~습니다, ~해요)를 사용하세요.
4. 학생의 수정 요청(예: "더 쉽게", "친구랑 간다는 걸 강조해줘", "재미있게 표현해줘", "짧게 줄여줘" 등)을 정확히 반영하세요.
5. 응답에는 오직 새로 수정된 [단 하나의 한국어 문장]만 텍스트로 출력하세요. 부가 설명이나 따옴표는 붙이지 마세요.`;

  const prompt = `[전체 발표문 맥락]
${currentSentences.map((s, idx) => `${idx === sentenceIndex ? '👉 [수정 대상] ' : '   '}(${idx + 1}) ${s}`).join('\n')}

[선택된 원본 문장]
${originalSentence}

[학생의 수정 요청]
"${studentRequest}"

위 요청에 맞춰 [선택된 원본 문장]을 대체할 완성된 단 하나의 한국어 문장을 출력하세요.`;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.MINIMAL,
        },
      },
    });

    const revised = response.text?.trim();
    if (revised && revised.length > 0) {
      // Remove any surrounding quotes if present
      return revised.replace(/^["']|["']$/g, '');
    }
  } catch (err) {
    console.error('Error in reviseSentence with Gemini:', err);
  }

  // Fallback simple heuristic revision
  if (studentRequest.includes('강조') || studentRequest.includes('더')) {
    return `${originalSentence} 특히 이 점이 저에게는 가장 특별합니다.`;
  }
  if (studentRequest.includes('짧') || studentRequest.includes('줄여')) {
    return originalSentence.split(',')[0] + '.';
  }
  return `${originalSentence} (수정 반영)`;
}

export async function generateListeningQuiz(
  finalScript: string,
  displayName: string,
  travelData?: TravelData
): Promise<{ q1: string; a1: string; q2: string; a2: string; q3: string; a3: string }> {
  const systemInstruction = `당신은 한국 중학교 교실 '발표 듣기 퀴즈(골든벨)' 문제 출제 전문가입니다.
학생이 발표한 [최종 발표문]을 주의 깊게 들은 친구들이 맞힐 수 있는 단답형 듣기 평가 문제 정확히 3문제를 만들어야 합니다.

[문제 출제 절대 규칙]
1. 반드시 발표문에 명시적으로 언급된 사실 정보(예: 여행지, 동행자, 기간, 꼭 하고 싶은 활동, 준비물, 이유, 예산 등)에 대해서만 문제를 출제하세요.
2. 발표문에 나오지 않은 외부 지식이나 막연한 추측을 요구하는 문제를 절대 내지 마세요.
3. 3개의 문제는 서로 중복되지 않는 서로 다른 사실을 물어보아야 합니다.
4. 문제와 정답은 모두 명확하고 간결한 한국어로 작성하세요. 정답은 1~3단어 내외의 명확한 단답형이어야 합니다.
5. JSON 포맷으로 q1, a1, q2, a2, q3, a3 키를 가진 객체로 출력하세요.`;

  const prompt = `발표자: ${displayName}
[학생의 최종 발표문]
"""
${finalScript}
"""

위 발표문의 구체적 사실에 기반한 단답형 듣기 퀴즈 3문제와 정확한 정답을 JSON 형식으로 작성하세요.`;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            q1: { type: Type.STRING, description: '첫 번째 듣기 퀴즈 질문 (한국어)' },
            a1: { type: Type.STRING, description: '첫 번째 퀴즈 정답 (단답형 한국어)' },
            q2: { type: Type.STRING, description: '두 번째 듣기 퀴즈 질문 (한국어)' },
            a2: { type: Type.STRING, description: '두 번째 퀴즈 정답 (단답형 한국어)' },
            q3: { type: Type.STRING, description: '세 번째 듣기 퀴즈 질문 (한국어)' },
            a3: { type: Type.STRING, description: '세 번째 퀴즈 정답 (단답형 한국어)' },
          },
          required: ['q1', 'a1', 'q2', 'a2', 'q3', 'a3'],
        },
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.MINIMAL,
        },
      },
    });

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);
    if (parsed.q1 && parsed.a1 && parsed.q2 && parsed.a2 && parsed.q3 && parsed.a3) {
      return parsed;
    }
  } catch (err) {
    console.error('Error in generateListeningQuiz with Gemini:', err);
  }

  // Fallback based on travel data
  const dest = travelData?.customDestination || travelData?.destination || '여행지';
  const companion = travelData?.customCompanion || travelData?.companion || '동행인';
  const mustDo = travelData?.mustDo || '활동';

  return {
    q1: `${displayName} 학생이 가고 싶어 하는 여행지는 어디인가요?`,
    a1: dest,
    q2: `${displayName} 학생은 누구와 함께 여행을 떠나고 싶어 하나요?`,
    a2: companion,
    q3: `${displayName} 학생이 이번 여행에서 꼭 하고 싶다고 밝힌 것은 무엇인가요?`,
    a3: mustDo,
  };
}

export async function generateTravelCard(
  finalScript: string,
  travelData: TravelData,
  displayName: string,
  participantId: string
): Promise<TravelCard> {
  const dest = travelData.customDestination || travelData.destination || '여행지';
  const theme = travelData.customPurpose || travelData.purpose || '즐거운 여행';
  const companion = travelData.customCompanion || travelData.companion || '친구';
  const duration = travelData.duration || '일정 미정';
  const budget = travelData.budget || '예산 미정';
  const mustDo = travelData.mustDo || '핵심 활동';

  let shortDesc = `${dest}에서 ${companion}와(과) 함께 ${mustDo}을(를) 즐기는 특별한 여행!`;

  try {
    const ai = getAiClient();
    const prompt = `학생 이름: ${displayName}
[발표문]
${finalScript}

위 발표문을 바탕으로 친구들이 보고 투표하고 싶어지도록 매력적이고 간결한 한 줄 여행 소개글(한국어 15~30자)을 작성하세요.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.MINIMAL,
        },
      },
    });

    const genDesc = response.text?.trim();
    if (genDesc && genDesc.length > 5) {
      shortDesc = genDesc.replace(/^["']|["']$/g, '');
    }
  } catch (err) {
    console.error('Error generating card description with Gemini:', err);
  }

  return {
    participantId,
    displayName,
    destination: dest,
    theme,
    companion,
    duration,
    budget,
    mustDo,
    shortDescription: shortDesc,
  };
}
