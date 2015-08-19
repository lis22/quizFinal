$(document).ready(function(){

  var currentQuestion,
  answerPos,
  questionChoices,
  questionQuote,
  score=0,
  pbValue=0,
  quoteCount=0,
  isCorrect = [],
  questionList=[],
  yourAnswer = [],
  questionListCopy=[];


  createQuizData();
  displayQuestion();
  initPicker();

  /* Creates a person object with a name, photo and quote */
  function MakePerson(name, photo, quote) {
    var person = {};
    person.name = name;
    person.photo = photo;
    person.quote = quote;

    person.getName = function() {
      return person.name;
    }

    person.getPhoto = function() {
      return person.photo;
    }
    person.getQuote = function() {
      return person.quote;
    }
    return person;
  }

  /*creates a question object. It is sent 3 person objects
  and the index of the correct answer. It can return the actual
  quoted person and their quote is found through its methods */
  function MakeQuestion(choice1, choice2, choice3, index) {
    var question = {};
    question.choices = [choice1, choice2, choice3];
    question.answerPos = index;

    question.getChoices = function() {
      return question.choices;
    }

    question.getAnswerPos = function() {
      return question.answerPos;
    }
    question.getQuotedPerson = function() {
      return question.choices[index];
    }
    return question;
  }

  /**creates the requred person objects and places them into quiz
  objects and builds a question list which is randomly shuffled */
  function createQuizData() {

    //create all people with their required values
    var alanKay = MakePerson("Alan Kay", "images/alan_kay.jpg", "If you're not failing 90% of the time, then you're probably not working on sufficiently challenging problems.");
    var edsgerDijkstra = MakePerson("Edsger Dijkstra", "images/edsger_dijkstra.jpg", "The question of whether a computer can think is no more interesting than the question of whether a submarine can swim.");
    var billGates = MakePerson("Bill Gates", "images/bill_gates.jpg", "Success is a lousy teacher. It seduces smart people into thinking they can’t lose.");
    var ericSchmidt = MakePerson("Eric Schmidt","images/eric_schmidt.jpg", "The Internet is the first thing that humanity has built that humanity doesn't understand, the largest experiment in anarchy that we have ever had.");
    var linusTorvalds = MakePerson("Linus Torvalds","images/linus_torvalds.jpg", "Most good programmers do programming not because they expect to get paid or get adulation by the public, but because it is fun to program");
    var markZuckerberg = MakePerson("Mark Zuckerberg", "images/mark_zuckerberg.jpg", "In a world that's changing really quickly, the only strategy that is guaranteed to fail is not taking risks.");
    var raymondKurzweil = MakePerson("Raymond Kurzweil", "images/raymond_kurzweil.jpg","By 2029, computers will have emotional intelligence and be convincing as people.");
    var stephenHawking = MakePerson("Stephen Hawking", "images/stephen_hawking.jpg", "I think computer viruses should count as life. I think it says something about human nature that the only form of life we have created so far is purely destructive. We've created life in our own image.");
    var steveJobs = MakePerson("Steve Jobs", "images/steve_jobs.jpg", "Innovation distinguishes between a leader and a follower.");
    var steveWozniak = MakePerson("Steve Wozniak", "images/steve_wozniak.jpg", "My goal wasn't to make a ton of money. It was to build good computers.");

    //create all questions with the correct choice of people and the index of the correct answer
    var question1  = MakeQuestion(billGates, steveJobs, markZuckerberg, 1);
    var question2  = MakeQuestion(steveWozniak, edsgerDijkstra, billGates, 2);
    var question3  = MakeQuestion(ericSchmidt, markZuckerberg, linusTorvalds, 2);
    var question4  = MakeQuestion(markZuckerberg, billGates, steveJobs, 0);
    var question5  = MakeQuestion(edsgerDijkstra, alanKay, stephenHawking, 1);
    var question6  = MakeQuestion(ericSchmidt, stephenHawking, steveJobs, 0);
    var question7  = MakeQuestion(alanKay, raymondKurzweil, steveWozniak, 1);
    var question8  = MakeQuestion(edsgerDijkstra, raymondKurzweil, stephenHawking, 2);
    var question9  = MakeQuestion(linusTorvalds, steveJobs, edsgerDijkstra, 2);
    var question10 = MakeQuestion(billGates, steveWozniak, steveJobs, 1);

    //create list of questions
    questionList = [question1, question2, question3, question4, question5, question6, question7, question8, question9, question10];

    //shuffle list of questions from: https://css-tricks.com/snippets/javascript/shuffle-array/
    questionList.sort(function() {
       return 0.5 - Math.random()
     });

    //copy of list of questions used for output since the original uses pop()
    questionListCopy = questionList.slice();
  }

  /* If the game still has questions it retrieves the question, resets the page
  elements and displays them otherwise calls to display end game data*/
  function displayQuestion() {

    if (questionList.length > 0) {
      currentQuestion = questionList.pop();
      answerPos = currentQuestion.getAnswerPos();
      questionChoices = currentQuestion.getChoices();
      questionQuote = currentQuestion.getQuotedPerson().getQuote();
      quoteCount++;

      //reset page items used to display
      $('select option').remove();
      $(".quote").empty();
      $(".quoteCounter").empty();

      //show new page text and update counter
      $(".quoteCounter").text("Quote: " + quoteCount);
      $(".quote").append(questionQuote);

      //add new people to select
      for(var i=0; i<questionChoices.length; i++)
      {
        $("select").append("<option data-img-label=" +"'" + questionChoices[i].getName() +"'"  + "data-img-src="+"'" + questionChoices[i].getPhoto()+"'" + "value=" +"'" + i +"'" +
        ">" + questionChoices[i].getName() + "</option>");
      }

      //reinitialize picker
      initPicker();

    }
    else
    displayGameResults();
  }

  /* Removes page elements not required, and creates new page elements to display a results table for the quiz */
  function displayGameResults() {

    //completely delete previous Quiz question page elements
    $("select").data('picker').destroy();
    $("select").remove();
    $(".quote").remove();
    $(".btn").remove();
    $(".quoteCounter").remove();

    //add new results page elements
    $(".quizContent").append("<h3> Thanks for playing! <br> Your score is " + score + " out of 10 </h3>");
    $(".quizContent").append(" <table class='table'><thead><tr><th>Quote</th><th>Your Answer</th> <th>Who Said It</th></tr></thead> <tbody>");
    $(".table").css({"text-align": "left"});


    //create table of result data
    for(var i=questionListCopy.length-1, k=0; i>=0; i--, k++)  {
      var tableColor;

      if (isCorrect[k])
      tableColor = "<tr class='success'><td>";
      else
      tableColor = "<tr class='danger'><td>";

      $(".table").append(tableColor + questionListCopy[i].getQuotedPerson().getQuote() + "</td><td>"  +
      yourAnswer[k] + "</td><td>" + questionListCopy[i].getQuotedPerson().getName() + "</td></tr>");
    }
  }


  /** called to initialize or reinitialize the image picker after being modified or added */
  function initPicker() {
    //so not selected when started
    $("select").prop("selectedIndex", -1);

    $("select").imagepicker({
      hide_select : true,
      show_label  : true
    })
  }

  /* When the submit button is pressed, gets the selected value if one is
  selected otherwise displays warning. Sends selected to feedback and advances to
  next question */
  $("form").submit(function(e) {
    e.preventDefault();

    //when an option is selected
    if ($('select option:selected').length > 0) {
      updateProgressBar();

      getSelectedChoice();

      displayQuestion();
    }
    else {
      $(".actualFeedback").text("You must select an item! ");
      $(".answerFeedback").css({"background-color": "#F2dede"});
    }

  });  //end submit

  /** retrieves the selected value which is a position element
  and retrieves the actual chosen answer's text, so the name of the person.
  Then calls for feedback*/
  function getSelectedChoice() {
    var selected = $("select").val();
    var chosenAnswer = $( "select option:selected" ).text();

    answerFeedback(selected, chosenAnswer);

  }

  /**provides feedback if answer was correct or incorrect */
  function answerFeedback(answerVal, answerText) {
    var name = currentQuestion.getQuotedPerson().getName();

    if (answerVal==answerPos) {
      $(".actualFeedback").text("You are correct! The answer is: " + name);
      $(".answerFeedback").css({"background-color": "#dff0d8"});
      score++;
      isCorrect.push(true);
      yourAnswer.push(answerText);
    }
    else  {
      $(".actualFeedback").text("You are wrong! The answer was: " + name);
      $(".answerFeedback").css({"background-color": "#f2dede"});
      isCorrect.push(false);
      yourAnswer.push(answerText);
    }
  }

  /* Since 10 questions updates progress bar by 10 each time an answer is submitted */
  function updateProgressBar() {
    pbValue+=10;
    $('.progress-bar').css('width', pbValue+'%').attr('aria-valuenow', pbValue);
    $('.progress-bar').text(pbValue + "%");
  }


}); //end document.ready
