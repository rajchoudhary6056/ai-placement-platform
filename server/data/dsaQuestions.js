const dsaQuestions = [
    {
      id: 1,
      title: "Two Sum",
      topic: "Arrays",
      difficulty: "Easy",
      description:
        "Given an array of integers nums and an integer target, find the indices of two numbers whose sum is equal to target.",
  
      input:
        "First line contains n. Second line contains n integers. Third line contains target.",
  
      output:
        "Print the two indices separated by a space.",
  
      explanation:
        "Use a HashMap to store previously visited numbers and their indices. For every number, check whether target - number already exists.",
  
      constraints:
        "2 <= n <= 100000",
  
      testCases: [
        {
          input: "4\n2 7 11 15\n9",
          expectedOutput: "0 1",
        },
        {
          input: "3\n3 2 4\n6",
          expectedOutput: "1 2",
        },
        {
          input: "2\n3 3\n6",
          expectedOutput: "0 1",
        },
      ],
    },
  
    {
      id: 2,
      title: "Find Maximum Element",
      topic: "Arrays",
      difficulty: "Easy",
  
      description:
        "Given an array of integers, find the maximum element.",
  
      input:
        "First line contains n. Second line contains n integers.",
  
      output:
        "Print the maximum element.",
  
      explanation:
        "Initialize maximum with the first element and traverse the array while updating maximum.",
  
      constraints:
        "1 <= n <= 100000",
  
      testCases: [
        {
          input: "5\n10 5 20 8 15",
          expectedOutput: "20",
        },
        {
          input: "4\n-5 -2 -10 -1",
          expectedOutput: "-1",
        },
        {
          input: "1\n100",
          expectedOutput: "100",
        },
      ],
    },
  
    {
      id: 3,
      title: "Reverse an Array",
      topic: "Arrays",
      difficulty: "Easy",
  
      description:
        "Given an array, reverse the array and print the resulting array.",
  
      input:
        "First line contains n. Second line contains n integers.",
  
      output:
        "Print the reversed array separated by spaces.",
  
      explanation:
        "Use two pointers, one at the beginning and one at the end, and swap elements until they meet.",
  
      constraints:
        "1 <= n <= 100000",
  
      testCases: [
        {
          input: "5\n1 2 3 4 5",
          expectedOutput: "5 4 3 2 1",
        },
        {
          input: "4\n10 20 30 40",
          expectedOutput: "40 30 20 10",
        },
        {
          input: "1\n7",
          expectedOutput: "7",
        },
      ],
    },
  
    {
      id: 4,
      title: "Check Palindrome String",
      topic: "Strings",
      difficulty: "Easy",
  
      description:
        "Given a string, check whether it is a palindrome.",
  
      input:
        "A single string.",
  
      output:
        'Print "YES" if the string is a palindrome otherwise print "NO".',
  
      explanation:
        "Compare characters from both ends moving toward the center.",
  
      constraints:
        "1 <= length <= 100000",
  
      testCases: [
        {
          input: "madam",
          expectedOutput: "YES",
        },
        {
          input: "hello",
          expectedOutput: "NO",
        },
        {
          input: "level",
          expectedOutput: "YES",
        },
      ],
    },
  
    {
      id: 5,
      title: "Binary Search",
      topic: "Searching",
      difficulty: "Easy",
  
      description:
        "Given a sorted array and a target value, find the index of the target. Return -1 if it does not exist.",
  
      input:
        "First line contains n. Second line contains sorted n integers. Third line contains target.",
  
      output:
        "Print the index of target or -1.",
  
      explanation:
        "Binary search repeatedly divides the search range into two halves.",
  
      constraints:
        "1 <= n <= 100000",
  
      testCases: [
        {
          input: "5\n1 3 5 7 9\n5",
          expectedOutput: "2",
        },
        {
          input: "5\n1 3 5 7 9\n8",
          expectedOutput: "-1",
        },
        {
          input: "1\n10\n10",
          expectedOutput: "0",
        },
      ],
    },
  
    {
      id: 6,
      title: "Bubble Sort",
      topic: "Sorting",
      difficulty: "Easy",
  
      description:
        "Sort an array in ascending order using Bubble Sort.",
  
      input:
        "First line contains n. Second line contains n integers.",
  
      output:
        "Print the sorted array.",
  
      explanation:
        "Repeatedly compare adjacent elements and swap them if they are in the wrong order.",
  
      constraints:
        "1 <= n <= 10000",
  
      testCases: [
        {
          input: "5\n5 1 4 2 8",
          expectedOutput: "1 2 4 5 8",
        },
        {
          input: "4\n4 3 2 1",
          expectedOutput: "1 2 3 4",
        },
        {
          input: "3\n1 2 3",
          expectedOutput: "1 2 3",
        },
      ],
    },
  
    {
      id: 7,
      title: "Reverse Linked List",
      topic: "Linked List",
      difficulty: "Medium",
  
      description:
        "Given a singly linked list, reverse the linked list and print its elements.",
  
      input:
        "First line contains n. Second line contains n integers.",
  
      output:
        "Print the reversed linked list.",
  
      explanation:
        "Use three pointers: previous, current and next. Reverse the next pointer of every node.",
  
      constraints:
        "1 <= n <= 10000",
  
      testCases: [
        {
          input: "5\n1 2 3 4 5",
          expectedOutput: "5 4 3 2 1",
        },
        {
          input: "3\n10 20 30",
          expectedOutput: "30 20 10",
        },
        {
          input: "1\n7",
          expectedOutput: "7",
        },
      ],
    },
  
    {
      id: 8,
      title: "Valid Parentheses",
      topic: "Stack",
      difficulty: "Easy",
  
      description:
        "Given a string containing parentheses, determine whether the brackets are valid.",
  
      input:
        "A string containing (), {}, and [].",
  
      output:
        'Print "YES" if valid otherwise "NO".',
  
      explanation:
        "Use a stack. Push opening brackets and match every closing bracket with the top of the stack.",
  
      constraints:
        "1 <= length <= 100000",
  
      testCases: [
        {
          input: "()[]{}",
          expectedOutput: "YES",
        },
        {
          input: "([{}])",
          expectedOutput: "YES",
        },
        {
          input: "([)]",
          expectedOutput: "NO",
        },
      ],
    },
  
    {
      id: 9,
      title: "First Non-Repeating Character",
      topic: "Hashing",
      difficulty: "Medium",
  
      description:
        "Given a string, find the first character that occurs only once. Print -1 if no such character exists.",
  
      input:
        "A single lowercase string.",
  
      output:
        "Print the first non-repeating character or -1.",
  
      explanation:
        "Count the frequency of every character and then traverse the string again to find the first character with frequency one.",
  
      constraints:
        "1 <= length <= 100000",
  
      testCases: [
        {
          input: "leetcode",
          expectedOutput: "l",
        },
        {
          input: "loveleetcode",
          expectedOutput: "v",
        },
        {
          input: "aabb",
          expectedOutput: "-1",
        },
      ],
    },
  
    {
      id: 10,
      title: "Factorial Using Recursion",
      topic: "Recursion",
      difficulty: "Easy",
  
      description:
        "Given a non-negative integer n, calculate its factorial using recursion.",
  
      input:
        "A single integer n.",
  
      output:
        "Print n factorial.",
  
      explanation:
        "The recursive relation is factorial(n) = n * factorial(n - 1), with factorial(0) = 1.",
  
      constraints:
        "0 <= n <= 15",
  
      testCases: [
        {
          input: "5",
          expectedOutput: "120",
        },
        {
          input: "0",
          expectedOutput: "1",
        },
        {
          input: "10",
          expectedOutput: "3628800",
        },
      ],
    },
  ];
  
  module.exports = dsaQuestions;