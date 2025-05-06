const { default: axios } = require("axios");

module.exports = {
  name: "trivia",
  description: "this is the trivia command",
  async execute(message, args) {
    let getQuestion = async () => {
      let response = await axios.default.get(
        "https://the-trivia-api.com/api/questions?limit=1"
      );
      let data = response.data;
      return data;
    };
    let questionData = await getQuestion();
    console.log(questionData[0]);


    const question = questionData[0];

    // Randomly choose which answer slot (1 to 4) will hold the correct answer
    const correctAnsNum = Math.floor(Math.random() * (5 - 1) + 1);
    let correctAnsEmoji = "";

    function reply(question, ans1, ans2, ans3, ans4, correctAnsEmoji) {
      message
        .reply(
          `${question.question}
        :regional_indicator_a: ${ans1} 
        :regional_indicator_b: ${ans2}
        :regional_indicator_c: ${ans3}
        :regional_indicator_d: ${ans4}`
        )
        .then((sentMessage) => {

          // Filter to accept only valid emoji reactions
          const filter = (reaction) => {
            return (
              reaction.emoji.name == "🇦" ||
              reaction.emoji.name == "🇧" ||
              reaction.emoji.name == "🇨" ||
              reaction.emoji.name == "🇩"
            );
          };
          
          // Wait for one valid reaction for up to 30 seconds
          sentMessage
            .awaitReactions({ filter, max: 1, time: 30000, errors: ["time"] })
            .then((collected) => {
              const reaction = collected.first();

              if (reaction.emoji.name === correctAnsEmoji) {
                sentMessage.react("✅");
              } else {
                sentMessage.react("❌");
              }
            })
            .catch((collected) => {
              sentMessage.edit(
                `${question.question}
              :regional_indicator_a: ${ans1} 
              :regional_indicator_b: ${ans2}
              :regional_indicator_c: ${ans3}
              :regional_indicator_d: ${ans4} \n Time ran out. Good luck next time. 🙁`
              );
            });
        });
    }

    if (correctAnsNum == 1) {
      reply(
        question,
        question.correctAnswer,
        question.incorrectAnswers[0],
        question.incorrectAnswers[1],
        question.incorrectAnswers[2],
        "🇦"
      );
    } else if (correctAnsNum == 2) {
      reply(
        question,
        question.incorrectAnswers[0],
        question.correctAnswer,
        question.incorrectAnswers[1],
        question.incorrectAnswers[2],
        "🇧"
      );
    } else if (correctAnsNum == 3) {
      reply(
        question,
        question.incorrectAnswers[0],
        question.incorrectAnswers[1],
        question.correctAnswer,
        question.incorrectAnswers[2],
        "🇨"
      );
    } else if (correctAnsNum == 4) {
      reply(
        question,
        question.incorrectAnswers[0],
        question.incorrectAnswers[1],
        question.incorrectAnswers[2],
        question.correctAnswer,
        "🇩"
      );
    }

    message
      .awaitReactions(
        (reaction) =>
          reaction.emoji.name == "🇦" ||
          reaction.emoji.name == "🇧" ||
          reaction.emoji.name == "🇨" ||
          reaction.emoji.name == "🇩",
        { max: 1, time: 10000 }
      )
      .then((collected) => {
        if (collected.first().emoji.name == correctAnsEmoji) {
          message.reply("Correct");
        } else message.reply("Wrong");
      })
      .catch(() => {
        message.reply("No answer after 60 seconds, Triva canceled.");
      });
  },
};
