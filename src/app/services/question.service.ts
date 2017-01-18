/**
 * Created by me on 8/15/2016.
 */
export class QuestionService {

grades = {
  text: ['A','B','C','D','F','None'],
  type: 'radio'
};

hoursPerWeek = {
  text: ['0', '< 1', '2-5', '5-10', '11-15', '15-20', '> 20' ]
};

numberConnections = {
  text: ['0', '< 50', '51-150', '151-250', '251-350', '351-450', '> 500']
};

  likert_agree_7 = {
    text: ['Disagree strongly', 'Disagree moderately',
      "Disagree a little", "Neither agree nor disagree", "Agree a little",
      'Agree moderately', 'Agree strongly'],
    numbers: [1, 2, 3, 4, 5, 6, 7],
    type: 'radio'
  };

   yes_no = {
    text: ['No','Yes'],
    numbers: [0,1],
    type: 'radio'
  };

   male_female = {
      text: ['Male','Female'],
      numbers: [0,1],
      type: 'radio'
    };

   political_parties = {
      text: ['Democrat','Republican','Independent'],
      numbers: [0,1,2],
      type: 'radio'
    };

   ethnicities = {
      text: ['White','Hispanic',
        'Black or African American',
        'Asian / Pacific Islander',
        'Other'],
      numbers: [0, 1, 2, 3, 4],
      type: 'radio'
    };

   age_ranges = {
      // text: ['18-24 years old',
     //   '25-34 years old',
     //   '35-44 years old',
     //   '45-54 years old',
     //   '55 years or older'],
     text: Array.from(new Array(83), (x,i) => i + 18),
     numbers: [0,1,2,3,4]
    };

   education_levels = {
      analysis_names: ['educationLevel'],
      questions: ['What is your highest education level?'],
      text: [
        'Some high school, no diploma',
        'High school graduate or equivalent',
        'Some college credit, no degree',
        'Associates degree',
        'Bachelors degree',
        'Masters degree',
        'Professional degree',
        'Doctorate degree'
      ],
      numbers: [0,1,2,3,4,5,6,7],
      type: 'radio'
    };

  //social media exp ---------------------------------------------------------------------
  num_social_media_qs = 6
  social_media = {
    instructions: `Please answer these questions about your social media use.`,
    questions: [
       'How many hours per week do you use Facebook?',
       'How many hours per week do you use Twitter?',
       'How many hours per week do you use Reddit?',
       'How many hours per week do you use Quora?',
       'About how many friends do you have on Facebook?',
       'About how many followers do you have on Twitter?'],
    analysis_names: [
      'hoursFacebook?',
      'hoursTwitter?',
      'hoursReddit?',
      'hoursQuora?',
      'friendsFacebook?',
      'followersTwitter?'],
    answer_format: [
      this.hoursPerWeek.text,
      this.hoursPerWeek.text,
      this.hoursPerWeek.text,
      this.hoursPerWeek.text,
      this.numberConnections.text,
      this.numberConnections.text],
    answer_tooltip: Array.apply(null, Array(this.num_social_media_qs)).map(function () {return ''})

  }


  //CREATIVE WRITING ---------------------------------------------------------------------
  num_creative_writing_qs = 9;
  creative_writing = {
    instructions: `Please answer these questions about your writing experience.`,
    analysis_names: [
      'highschoolwriting_grade',
      'collegelwriting_grade',
      'avg_time_writing',
      'shortwork',
      'writing_prize',
      'longwork',
      'soldwriting',
      'localreview',
      'nationreview'
    ],
    questions: [
      'What grade did you usually get on your writing assignments in high school?',
      'What grade did you usually get on your writing assignments in college?',
      'How many hours a week on average do you currently spend writing for work, fun, or socializing?',
      'Have you written an original short work (poem or short story)?',
      'Has your writing won an award or prize?',
      'Have you written an original long work (epic, novel, or play)?',
      'Have you sold your writing to a publisher?',
      'Has your writing been reviewed in local publications?',
      'Has your writing been reviewed in national publications?'
    ],
    answer_format: [
      this.grades.text,
      this.grades.text,
      this.hoursPerWeek.text,
      this.yes_no.text,
      this.yes_no.text,
      this.yes_no.text,
      this.yes_no.text,
      this.yes_no.text,
      this.yes_no.text],
    answer_tooltip: Array.apply(null, Array(this.num_creative_writing_qs)).map(function () {return ''})
  }


  //DEMOGRAPHICS -------------------------------------------------------------
    num_demo_qs = 6;
    demographics = {
      instructions: `Please answer each question.`,
      analysis_names: [
         'age',
         'education',
         'politicalParty',
         'votePlans',
         'gender',
         'ethnicity'
      ],
      questions: [
        'How old are you?',
        'What is your highest level of education?',
        'What is your political affiliation?',
        'Are you planning to vote this November?',
        'What is your gender?',
        'What ethnicity do you most identify with?',
      ],
      answer_format: [
         this.age_ranges.text,
         this.education_levels.text,
         this.political_parties.text,
         this.yes_no.text,
         this.male_female.text,
         this.ethnicities.text],
      answer_tooltip: Array.apply(null, Array(this.num_demo_qs)).map(function () {return ''})
    };

  //personality -------------------------------------------------------------
  num_personality_qs =  9;
  personality =  {
    answer_format:  this.repeat_element(this.likert_agree_7.numbers,this.num_personality_qs),
    answer_tooltip: this.repeat_element(this.likert_agree_7.text,this.num_personality_qs),
       analysis_names: [
      "Critical_quarrelsome",
      "Dependable_self-disciplined",
      "Anxious_easilyUpset",
      "OpenToNewExperiences_complex",
      "Reserved_quiet",
      "Sympathetic_warm",
      "Disorganized_careless",
      "Calm_emotionallyStable",
      "Conventional_uncreative"
    ],
       questions: [
      "Critical, quarrelsome:",
      "Dependable, self-disciplined:",
      "Anxious, easily upset:",
      "Open to new experiences, complex:",
      "Reserved, quiet:",
      "Sympathetic, warm:",
      "Disorganized, careless:",
      "Calm, emotionally stable:",
      "Conventional, uncreative:"],
       instructions: `
              This is a short personality test. Please click a number next to each statement to indicate 
              the extent to which you agree or disagree with each statement.
              A 1 means you disagree strongly and 7 means you agree strongly.
              You should rate the extent to which the pair
              of traits applies to you, even if one characteristic applies more strongly than the
              other. <br> <hr> I see myself as: <br>`
    };


  //creative_self_efficacy -------------------------------------------------------------
  num_CSE_qs = 8
  repeat_element(thing2repeat, times2repeat){
    var arr = []
    for (var i = 0; i < times2repeat; i++) {
      arr.push(thing2repeat)
    }
    return arr;
  }

  creative_self_efficacy = {
    answer_format:  this.repeat_element(this.likert_agree_7.numbers,this.num_CSE_qs),
    answer_tooltip: this.repeat_element(this.likert_agree_7.text,this.num_CSE_qs),
    questions: [
      "When facing difficult tasks, I am certain that I will accomplish them creatively:",
      "In general, I think that I can obtain outcomes that are important to me in a creative way:",
      "I am confident that I can perform creatively on many different tasks:",
      "Compared to other people, I can do most tasks very creatively:",
      "Even when things are tough, I can perform quite creatively:"
    ],
    analysis_names: [
      "cse_difficult_tasks",
      "cse_outcomes",
      "cse_overcome_challenges",
      "cse_compared_to_others",
      "cse_tough"
    ],
    instructions: `
            Please click a number next to each statement to indicate the extent to which you
            agree  or disagree with that statement. 1 indicates you disagree strongly and 7 indicates you 
            agree strongly.`
  }

  //post -------------------------------------------------------------
  num_post_qs = 12;
  post_survey = {
    answer_format:  this.repeat_element(this.likert_agree_7.numbers,this.num_post_qs),
    answer_tooltip: this.repeat_element(this.likert_agree_7.text,this.num_post_qs),
    analysis_names: [
     //interaction
     "differentAsPeople",
     "thoughtDifferently",
     "partnerComments",
     "myComments",
     //task and goal interdependence
     "onMyOwn",
     "iPerform",
     "partnerPerform",
     "enjoyed",
     "workedWellTogether",
     //hostility
     "neverHostile",
     //similar or different
     "similarAsPeople",
     "thoughtSimilarly",
   ],
    questions: [
      //interaction
      "My partner and I were very different as people",
      "My partner and I thought very differently about this task",
      "My partner's comments were helpful:",
      "My ideas and comments were helpful:",
      //task and goal interdependence
      "I could have done this task equally well on my own:",
      "I wanted to perform well on this task:",
      "My partner wanted to perform well on this task:",
      "I enjoyed working with my partner on this task:",
      "My partner and I worked well together:",
      //hostility
      "My partner was never hostile when we interacted.",
      //similar or different
      "My partner and I were very similar as people",
      "My partner and I thought very similarly about this task",
    ],
    instructions: `
      Please click a number next to each statement to indicate the extent to which you
      agree  or disagree with that statement. 1 indicates you disagree strongly and 7 indicates you
      agree strongly.`
  }

}