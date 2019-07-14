const questionOperations = {
  questions: [],

  add(questionObject) {
    this.questions.push(questionObject);
    console.log("Added", this.questions);
  },
  countMark() {
    return this.questions.filter(question => question.markForDelete).length;
  },
  toggleMark(id) {
    var questionObject = this.questions.find(question => question.id == id);
    questionObject.markForDelete = !questionObject.markForDelete;
  },

  remove() {
    this.questions = this.questions.filter(question => !question.markForDelete);
  },
  search() {
    if (!value) {
      return this.questions;
    }
    return this.questions.filter(question => question[key] == value); //ask sir what we are doing here!
  },
  sortQues(value) {
    //sort function compares two variables and returns a value between negative positive and 0
    if (value == "score") {
      return this.questions.sort(function(a, b) {
        return a.score - b.score;
      });
    } else {
      {
        return this.questions.sort(function(a, b) {
          return a.id - b.id;
        });
      }
    }
  }
};
