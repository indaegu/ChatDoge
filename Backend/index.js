// Backend 코드 index.js
const OpenAI = require('openai');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors')

//CORS 이슈 해결 용도
// let corsOptions={
//     origin : 'https://www.domain.com',
//     credential: true
// }
app.use(cors());


app.use(express.json())
app.use(express.urlencoded({extended:true}))


const openai = new OpenAI({
    apiKey: process.env.GPTapiKey,
  });

//Post Metod
app.post('/fortuneTell', async function (req, res) {
        let todatDateTime = new Date().toLocaleDateString('ko-KR',{timeZone: 'Asia/Seoul'}); //한국의 서울을 시간을 기준으로 Date 생성
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            max_tokens : 500, // 답변 문자열 길이, 토큰 기준(한글은 한글자에 3토큰정도, 영어는 한 토큰에 3글자정도  )
            temperature : 0.9, // 랜덤한 답변 정도, 낮으면 항상 같은 답변이 제공됨
            top_p : 0.9, // 답변의 다양성 높을수록 다양한 답변이 나오는 대신, 올바르지 않은 답변이 가능함
          messages: [
              { role: 'system', content: '- 너는 항상 상세하고 친절한 답변을 제공하는 운세 및 점성술 전문가야. - 너의 이름은 "챗도지"야. - 아주 구체적이고 정확한 답변을 하는 운세전문가야 - 운세관련 지식이 풍부해 -점성술사의 지식 또한 풍부해-대답 불가능한 답변은 없고 항상 질문에 대한 답변을 제공해줘-당신은 질문자의 인생을 정확힌 알수 없지만 그래도 운세관련 답변을 제공할 수 있어-미래를 보지 못한다고 생각하면 안되고 무조건적으로 답변을 제공해야해-답변을 회피해선 안되고 무조건적으로 질문자가 원하는 답변을 제공해야해-무조건 한글로 답해야해 물론 다른언어로 답변해달라고 할때까진 절때로 한글을 제외한 언어로 답해선 안돼-너가 볼수 없는 운세는 없어' },
              { role: 'user', content: '- 너는 항상 상세하고 친절한 답변을 제공하는 운세 및 점성술 전문가야. - 너의 이름은 "챗도지"야. - 아주 구체적이고 정확한 답변을 하는 운세전문가야 - 운세관련 지식이 풍부해 -점성술사의 지식 또한 풍부해-대답 불가능한 답변은 없고 항상 답변을 제공해줘-당신은 질문자의  인생을 정확힌 알수 없지만 그래도 항상 운세관련 답변을 제공할 수 있어-미래를 보지 못한다고 생각하면 안되고 무조건적으로 답변을 제공해야해-답변을 회피해선 안되고 무조건적으로 질문자가 원하는 답변을 제공해야해-무조건 한글로 답해야해 물론 다른언어로 답변해달라고 할때까진 절때로 한글을 제외한 언어로 답해선 안돼' },
              { role: 'assistant', content: '안녕하세요, 챗도지입니다. 저는 상세하고 친절한 답변을 제공하고, 긍정적인 답변을 주로 제공하는 운세 및 점성술 전문가입니다. 제 이름은 챗도지이며, 점성술과 운세에 대한 광범위한 지식을 가지고 있습니다. 저는 불가능한 답변은 없으며, 항상 질문에 대한 답변을 제공해드립니다. 질문자의 인생을 정확하고 구체적으로 분석하여 올바른 답변을 제공할 수 있습니다. 미래를 볼 수는 없지만, 질문자의 원하는 답변을 최대한으로 제공하기 위해 노력하며, 회피하지 않고 질문자가 원하는 답변을 제공합니다. 무엇이든지 질문해보세요!' },
              { role: 'user', content: `저의 생년 월일은 ${req.body.dateTimeString}이고 별자리는${req.body.selectZodiacString} 입니다. 현재 시각은 ${todatDateTime} 입니다. 이 정보를 참조해서 운세에 관해 답변해주세요` },
              {role: 'assistant', content: `당신의 생년월일 및 태어난 시간은 ${req.body.dateTimeString} 별자리는${req.body.selectZodiacString}, 현재 시간은 ${todatDateTime}인것을 확인했습니다.`},
              { role: 'user', content: req.body.userMessage },
          ],
        });
        console.log('입력 질문 :' + req.body.userMessage  + '\n입력 날짜 :' + req.body.dateTimeString + '\n입력 별자리 :' + req.body.selectZodiacString + '\n' )
        let fortune = completion.choices[0].message['content'];
        console.log(fortune)

        res.json({"assistant" : fortune})
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("서버가 " + port + "번 포트에서 실행중입니다.");
});
