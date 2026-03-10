import React from "react";
import {
  Layers,
  GitBranch,
  Binary,
  TreePine,
  Share2,
  Boxes,
  Braces,
  ListTree,
  Code2
} from "lucide-react";

export interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  platform: "LeetCode" | "GFG" | "CodeStudio";
  url: string;
}

export interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  problems: Problem[];
}

export const DSA_SECTIONS: Section[] = [
  {
    id: "arrays", title: "Arrays", icon: <Layers className="w-5 h-5" />, color: "text-blue-500", gradient: "from-blue-500 to-cyan-500",
    problems: [
      { id: "a1", title: "Two Sum", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/two-sum" },
      { id: "a2", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock" },
      { id: "a3", title: "Contains Duplicate", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/contains-duplicate" },
      { id: "a4", title: "Maximum Subarray (Kadane's)", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/maximum-subarray" },
      { id: "a5", title: "Merge Intervals", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/merge-intervals" },
      { id: "a6", title: "Sort Colors (Dutch National Flag)", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/sort-colors" },
      { id: "a7", title: "Next Permutation", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/next-permutation" },
      { id: "a8", title: "Set Matrix Zeroes", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/set-matrix-zeroes" },
      { id: "a9", title: "Rotate Image", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/rotate-image" },
      { id: "a10", title: "Trapping Rain Water", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/trapping-rain-water" },
      { id: "a11", title: "Product of Array Except Self", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/product-of-array-except-self" },
      { id: "a12", title: "3Sum", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/3sum" },
    ],
  },
  {
    id: "strings", title: "Strings", icon: <Braces className="w-5 h-5" />, color: "text-emerald-500", gradient: "from-emerald-500 to-teal-500",
    problems: [
      { id: "s1", title: "Reverse String", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/reverse-string" },
      { id: "s2", title: "Valid Anagram", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/valid-anagram" },
      { id: "s3", title: "Valid Palindrome", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/valid-palindrome" },
      { id: "s4", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters" },
      { id: "s5", title: "Longest Palindromic Substring", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/longest-palindromic-substring" },
      { id: "s6", title: "Group Anagrams", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/group-anagrams" },
      { id: "s7", title: "String to Integer (atoi)", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/string-to-integer-atoi" },
      { id: "s8", title: "Minimum Window Substring", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/minimum-window-substring" },
      { id: "s9", title: "Implement strStr() / KMP Algorithm", difficulty: "Medium", platform: "GFG", url: "https://www.geeksforgeeks.org/kmp-algorithm-for-pattern-searching/" },
      { id: "s10", title: "Rabin Karp Algorithm", difficulty: "Hard", platform: "GFG", url: "https://www.geeksforgeeks.org/rabin-karp-algorithm-for-pattern-searching/" },
    ],
  },
  {
    id: "linked-list", title: "Linked List", icon: <GitBranch className="w-5 h-5" />, color: "text-violet-500", gradient: "from-violet-500 to-purple-500",
    problems: [
      { id: "l1", title: "Reverse Linked List", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/reverse-linked-list" },
      { id: "l2", title: "Merge Two Sorted Lists", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/merge-two-sorted-lists" },
      { id: "l3", title: "Linked List Cycle", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/linked-list-cycle" },
      { id: "l4", title: "Remove Nth Node From End", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list" },
      { id: "l5", title: "Add Two Numbers", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/add-two-numbers" },
      { id: "l6", title: "Reorder List", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/reorder-list" },
      { id: "l7", title: "Copy List with Random Pointer", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/copy-list-with-random-pointer" },
      { id: "l8", title: "Merge k Sorted Lists", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/merge-k-sorted-lists" },
      { id: "l9", title: "Flatten a Linked List", difficulty: "Medium", platform: "GFG", url: "https://www.geeksforgeeks.org/flattening-a-linked-list/" },
    ],
  },
  {
    id: "stack-queue", title: "Stack & Queue", icon: <ListTree className="w-5 h-5" />, color: "text-orange-500", gradient: "from-orange-500 to-amber-500",
    problems: [
      { id: "sq1", title: "Valid Parentheses", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/valid-parentheses" },
      { id: "sq2", title: "Min Stack", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/min-stack" },
      { id: "sq3", title: "Next Greater Element I", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/next-greater-element-i" },
      { id: "sq4", title: "Evaluate Reverse Polish Notation", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation" },
      { id: "sq5", title: "Daily Temperatures", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/daily-temperatures" },
      { id: "sq6", title: "Implement Queue using Stacks", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/implement-queue-using-stacks" },
      { id: "sq7", title: "Sliding Window Maximum", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/sliding-window-maximum" },
      { id: "sq8", title: "Largest Rectangle in Histogram", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/largest-rectangle-in-histogram" },
      { id: "sq9", title: "LRU Cache", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/lru-cache" },
    ],
  },
  {
    id: "recursion", title: "Recursion", icon: <Boxes className="w-5 h-5" />, color: "text-pink-500", gradient: "from-pink-500 to-rose-500",
    problems: [
      { id: "r1", title: "Subsets", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/subsets" },
      { id: "r2", title: "Permutations", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/permutations" },
      { id: "r3", title: "Combination Sum", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/combination-sum" },
      { id: "r4", title: "Letter Combinations of a Phone Number", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number" },
      { id: "r5", title: "Generate Parentheses", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/generate-parentheses" },
      { id: "r6", title: "N-Queens", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/n-queens" },
      { id: "r7", title: "Sudoku Solver", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/sudoku-solver" },
      { id: "r8", title: "Word Search", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/word-search" },
      { id: "r9", title: "Palindrome Partitioning", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/palindrome-partitioning" },
    ],
  },
  {
    id: "binary-search", title: "Binary Search", icon: <Binary className="w-5 h-5" />, color: "text-cyan-500", gradient: "from-cyan-500 to-sky-500",
    problems: [
      { id: "bs1", title: "Binary Search", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/binary-search" },
      { id: "bs2", title: "Search Insert Position", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/search-insert-position" },
      { id: "bs3", title: "Find First and Last Position", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array" },
      { id: "bs4", title: "Search in Rotated Sorted Array", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/search-in-rotated-sorted-array" },
      { id: "bs5", title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array" },
      { id: "bs6", title: "Koko Eating Bananas", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/koko-eating-bananas" },
      { id: "bs7", title: "Median of Two Sorted Arrays", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/median-of-two-sorted-arrays" },
      { id: "bs8", title: "Aggressive Cows", difficulty: "Hard", platform: "GFG", url: "https://www.geeksforgeeks.org/aggressive-cows/" },
      { id: "bs9", title: "Book Allocation Problem", difficulty: "Hard", platform: "GFG", url: "https://www.geeksforgeeks.org/allocate-minimum-number-pages/" },
    ],
  },
  {
    id: "trees", title: "Trees", icon: <TreePine className="w-5 h-5" />, color: "text-green-500", gradient: "from-green-500 to-lime-500",
    problems: [
      { id: "t1", title: "Maximum Depth of Binary Tree", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree" },
      { id: "t2", title: "Invert Binary Tree", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/invert-binary-tree" },
      { id: "t3", title: "Same Tree", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/same-tree" },
      { id: "t4", title: "Binary Tree Level Order Traversal", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/binary-tree-level-order-traversal" },
      { id: "t5", title: "Lowest Common Ancestor of BST", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree" },
      { id: "t6", title: "Validate Binary Search Tree", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/validate-binary-search-tree" },
      { id: "t7", title: "Construct Binary Tree from Preorder and Inorder", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal" },
      { id: "t8", title: "Diameter of Binary Tree", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/diameter-of-binary-tree" },
      { id: "t9", title: "Binary Tree Maximum Path Sum", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum" },
      { id: "t10", title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree" },
      { id: "t11", title: "Morris Traversal", difficulty: "Medium", platform: "GFG", url: "https://www.geeksforgeeks.org/morris-traversal-for-preorder/" },
    ],
  },
  {
    id: "graphs", title: "Graphs", icon: <Share2 className="w-5 h-5" />, color: "text-red-500", gradient: "from-red-500 to-rose-500",
    problems: [
      { id: "g1", title: "Number of Islands", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/number-of-islands" },
      { id: "g2", title: "Clone Graph", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/clone-graph" },
      { id: "g3", title: "Course Schedule", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/course-schedule" },
      { id: "g4", title: "Pacific Atlantic Water Flow", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/pacific-atlantic-water-flow" },
      { id: "g5", title: "Word Ladder", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/word-ladder" },
      { id: "g6", title: "Dijkstra's Algorithm", difficulty: "Medium", platform: "GFG", url: "https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/" },
      { id: "g7", title: "Bellman-Ford Algorithm", difficulty: "Medium", platform: "GFG", url: "https://www.geeksforgeeks.org/bellman-ford-algorithm-dp-23/" },
      { id: "g8", title: "Topological Sort", difficulty: "Medium", platform: "GFG", url: "https://www.geeksforgeeks.org/topological-sorting/" },
      { id: "g9", title: "Detect Cycle in Directed Graph", difficulty: "Medium", platform: "GFG", url: "https://www.geeksforgeeks.org/detect-cycle-in-a-graph/" },
      { id: "g10", title: "Minimum Spanning Tree (Kruskal's)", difficulty: "Hard", platform: "GFG", url: "https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/" },
    ],
  },
  {
    id: "dp", title: "Dynamic Programming", icon: <Code2 className="w-5 h-5" />, color: "text-indigo-500", gradient: "from-indigo-500 to-violet-500",
    problems: [
      { id: "dp1", title: "Climbing Stairs", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/climbing-stairs" },
      { id: "dp2", title: "House Robber", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/house-robber" },
      { id: "dp3", title: "Coin Change", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/coin-change" },
      { id: "dp4", title: "Longest Increasing Subsequence", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/longest-increasing-subsequence" },
      { id: "dp5", title: "Longest Common Subsequence", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/longest-common-subsequence" },
      { id: "dp6", title: "Word Break", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/word-break" },
      { id: "dp7", title: "0/1 Knapsack Problem", difficulty: "Medium", platform: "GFG", url: "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/" },
      { id: "dp8", title: "Edit Distance", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/edit-distance" },
      { id: "dp9", title: "Partition Equal Subset Sum", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/partition-equal-subset-sum" },
      { id: "dp10", title: "Burst Balloons", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/burst-balloons" },
      { id: "dp11", title: "Matrix Chain Multiplication", difficulty: "Hard", platform: "GFG", url: "https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/" },
      { id: "dp12", title: "Unique Paths", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/unique-paths" },
    ],
  },
];

export const TOTAL_PROBLEMS = DSA_SECTIONS.reduce((t, s) => t + s.problems.length, 0);
