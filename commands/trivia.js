const { default: axios } = require("axios");

module.exports = {
  name: "trivia",
  description: "this is the trivia command",
  
  async execute(message, args) {
    async function getQuestion() {
      const response = await axios.default.get(
        "https://the-trivia-api.com/api/questions?limit=1"
      );
      return response.data[0];
    };
    
    // Shuffle answers and track the correct one
    function shuffleAnswers(correctAnswer, incorrectAnswers) {
      const allAnswers = [...incorrectAnswers, correctAnswer];
      for (let i = allAnswers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
      }
      return allAnswers;
    }


    const question = await getQuestion();
    const answers = shuffleAnswers(question.correctAnswer, question.incorrectAnswers);
    const correctIndex = answers.indexOf(question.correctAnswer);
    const emojiList = ["🇦", "🇧", "🇨", "🇩"];

    // Send the trivia question with choices
    const sentMessage = await message.reply(
      `**Trivia Time!**\n${question.question}\n` +
        answers
          .map((ans, i) => `${emojiList[i]} ${ans}`)
          .join("\n")
    );

    // Add emoji reactions to the message
    for (let i = 0; i < answers.length; i++) {
      await sentMessage.react(emojiList[i]);
    }

    // Set up a reaction filter and wait for user's answer
    const filter = (reaction, user) => {
      return (
        emojiList.includes(reaction.emoji.name) &&
        user.id === message.author.id // only allow the message author to answer
      );
    };

    try {
      const collected = await sentMessage.awaitReactions({
        filter,
        max: 1,
        time: 30000,
        errors: ["time"],
      });

      const userReaction = collected.first();
      const userAnswerIndex = emojiList.indexOf(userReaction.emoji.name);

      if (userAnswerIndex === correctIndex) {
        message.reply("✅ Correct! Nice job!");
      } else {
        message.reply(`❌ Wrong! The correct answer was **${question.correctAnswer}**.`);
      }
    } catch (error) {
      message.reply("⏰ Time's up! Better luck next time.");
    }
  },
};
