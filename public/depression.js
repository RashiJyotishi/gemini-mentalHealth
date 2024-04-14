const Data = [
    {
        question : "Trouble falling asleep, staying asleep, or sleeping too much?:"
    },
    {
        question : "Feeling down, depressed, or hopeless?"
    },
    {
        question : "Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?"
    },
    {
        question : "Trouble concentrating on things, such as reading the newspaper or watching television?"
    },
    {
        question : "Thoughts that you would be better off dead, or of hurting yourself?:"
    },
    {
        question : "Feeling bad about yourself - or that you are a failure or have let yourself or your family down?:"
    },
]

const responses = [
    {
        Results: "You appear to have minimal symptoms of depression. Your results indicate that you have none, or very few signs of depression. These results are not meant to be a diagnosis. You can meet with a doctor or therapist to get a diagnosis and/or access therapy or medications. Sharing these results with someone you trust can be a great place to start"},
    {
        Results: "You may be experiencing mild symptoms of depression. Consider seeking support.Your responses indicate that you may be at risk of harming yourself. If you need immediatehelp, you can reach the Suicide & Crisis Lifeline by calling or texting 988 or using thechat box at 988lifeline.org. You can also text “MHA” to 741-741 to reach the Crisis TextLine. Warmlines are an excellent place for non-crisis support."
    },
    {
        Results: "Your depression symptoms are severe. Please seek immediate help. Your responses indicate that you may be at risk of harming yourself. If you need immediate help, you can reach the Suicide & Crisis Lifeline by calling or texting 988 or using the chat box at 988lifeline.org. You can also text “MHA” to 741-741 to reach the Crisis Text Line. Warmlines are an excellent place for non-crisis support"
    },
]

const quiz = document.querySelector(".quiz-body");
const answerEL = document.querySelectorAll(".answer");
const questionEL = document.getElementById("question");
const footerEL = document.querySelector('.quiz-footer');
const quizDetailEL = document.querySelector(".quiz-details");

const sendBtn = document.getElementById('btn');

let currentQuiz = 0;
let score = 0;

LoadQuiz();
const demo = select();
// console.log(select);
unselect();

function LoadQuiz(){
    const currentQuizData = Data[currentQuiz]
    questionEL.innerText = currentQuizData.question;
}

function unselect(){
    answerEL.forEach((answerEL)=>{
        // console.log(answerEL.checked);
        answerEL.checked = false;
    })
}

function select(){
    let answer;
    answerEL.forEach((answerEL)=>{
        if(answerEL.checked){
            // console.log(answerEL.id);
            answer = answerEL.id
        }
    });
    return answer; 
}

sendBtn.addEventListener("click",()=>{
    const ans = select();
    // console.log(ans); 
    if(ans==='a'){
        score++;
    } 
    
    currentQuiz++;
    unselect();

    // quizDetailEL.innerHTML = `<div></div>`
    quizDetailEL.innerText = (currentQuiz+1) + " of 6 questions";
    if(currentQuiz<(Data.length)){
        LoadQuiz();
    }else{
        if(score===0){
            const resp = responses[score];
        quiz.innerHTML = `<h3>${resp.Results}</h3>
        <button type="button" onclick = "location.reload()">Reload</button>`;
        footerEL.style.display = "none";

        }else if(score>0&&score<3){
            const resp = responses[1];
            quiz.innerHTML = `<h3>${resp.Results}</h3>
            <button type="button" onclick = "location.reload()">Reload</button>`;
            footerEL.style.display = "none";
        }else{
            const resp = responses[2];
            quiz.innerHTML = `<h3>${resp.Results}</h3>
            <button type="button" onclick = "location.reload()">Reload</button>`;
            footerEL.style.display = "none";
        }
        // <h2> you answered ${score}</h2>
    }
});

