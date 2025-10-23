// Quiz questions organized by content ID
export const quizQuestions = {
  '1': [
    {
      question: "What is the smallest prime number?",
      options: ["0", "1", "2", "3"],
      correct: 2
    },
    {
      question: "Which of the following is an even number?",
      options: ["7", "13", "24", "31"],
      correct: 2
    },
    {
      question: "What is the sum of the first 5 natural numbers?",
      options: ["10", "12", "15", "20"],
      correct: 2
    },
    {
      question: "Which number is a multiple of both 3 and 4?",
      options: ["8", "12", "15", "18"],
      correct: 1
    },
    {
      question: "What is the value of 2³?",
      options: ["4", "6", "8", "10"],
      correct: 2
    }
  ],
  '2': [
    {
      question: "What is the prime factorization of 12?",
      options: ["2 × 3", "2² × 3", "3 × 4", "2 × 6"],
      correct: 1
    },
    {
      question: "Which of these is a prime number?",
      options: ["15", "21", "23", "25"],
      correct: 2
    },
    {
      question: "What is the greatest common factor of 8 and 12?",
      options: ["2", "4", "6", "8"],
      correct: 1
    },
    {
      question: "What is the least common multiple of 6 and 8?",
      options: ["12", "24", "36", "48"],
      correct: 1
    },
    {
      question: "How many factors does 16 have?",
      options: ["3", "4", "5", "6"],
      correct: 2
    }
  ],
  '3': [
    {
      question: "What is 15 + 27?",
      options: ["40", "42", "43", "45"],
      correct: 1
    },
    {
      question: "What is 50 - 23?",
      options: ["25", "27", "28", "30"],
      correct: 1
    },
    {
      question: "What is 8 × 7?",
      options: ["54", "56", "58", "60"],
      correct: 1
    },
    {
      question: "What is 72 ÷ 8?",
      options: ["7", "8", "9", "10"],
      correct: 2
    },
    {
      question: "What is the value of 5² + 3?",
      options: ["13", "23", "28", "33"],
      correct: 2
    }
  ],
  '4': [
    {
      question: "What is 0.5 + 0.3?",
      options: ["0.8", "0.15", "0.53", "0.35"],
      correct: 0
    },
    {
      question: "Which decimal is equivalent to 1/4?",
      options: ["0.25", "0.4", "0.5", "0.75"],
      correct: 0
    },
    {
      question: "What is 2.5 × 4?",
      options: ["8", "10", "12", "15"],
      correct: 1
    },
    {
      question: "Which is the largest decimal?",
      options: ["0.7", "0.75", "0.8", "0.85"],
      correct: 3
    },
    {
      question: "What is 1.2 ÷ 0.3?",
      options: ["3", "4", "5", "6"],
      correct: 1
    }
  ],
  '5': [
    {
      question: "What is 25% of 80?",
      options: ["15", "20", "25", "30"],
      correct: 1
    },
    {
      question: "Which fraction is equivalent to 50%?",
      options: ["1/3", "1/2", "2/3", "3/4"],
      correct: 1
    },
    {
      question: "What is 0.6 as a percentage?",
      options: ["6%", "60%", "600%", "0.6%"],
      correct: 1
    },
    {
      question: "If 20% of a number is 30, what is the number?",
      options: ["120", "150", "180", "200"],
      correct: 1
    },
    {
      question: "What is 3/4 as a percentage?",
      options: ["34%", "43%", "75%", "85%"],
      correct: 2
    }
  ],
  '6': [
    {
      question: "What is the perimeter of a square with side length 5 cm?",
      options: ["15 cm", "20 cm", "25 cm", "30 cm"],
      correct: 1
    },
    {
      question: "What is the area of a rectangle 6 cm by 4 cm?",
      options: ["20 cm²", "24 cm²", "28 cm²", "32 cm²"],
      correct: 1
    },
    {
      question: "What is the circumference of a circle with radius 7 cm? (Use π ≈ 3.14)",
      options: ["21.98 cm", "43.96 cm", "65.94 cm", "87.92 cm"],
      correct: 1
    },
    {
      question: "What is the volume of a cube with edge length 3 cm?",
      options: ["9 cm³", "18 cm³", "27 cm³", "36 cm³"],
      correct: 2
    },
    {
      question: "What is the area of a triangle with base 8 cm and height 6 cm?",
      options: ["20 cm²", "24 cm²", "28 cm²", "32 cm²"],
      correct: 1
    }
  ]
};

// Function to get questions for a specific content ID
export const getQuestionsForContent = (contentId) => {
  return quizQuestions[contentId] || quizQuestions['1'];
};
