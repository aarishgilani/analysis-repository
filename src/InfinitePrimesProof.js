import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, ArrowRight, Award, Brain, Sparkles } from 'lucide-react';

const InfinitePrimesProof = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showHints, setShowHints] = useState({});
  const [completedLevels, setCompletedLevels] = useState([]);
  const [interactiveState, setInteractiveState] = useState({});

  const levels = [
    {
      id: 0,
      title: "The Brilliant Insight: Euclid's Approach",
      content: (
        <div className="space-y-4">
          <p className="text-lg">Around 300 BCE, Euclid proved one of the most elegant theorems in mathematics: <strong>there are infinitely many prime numbers</strong>.</p>
          
          <div className="p-6 border-2 border-purple-200 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
            <p className="mb-3 text-lg font-semibold">The Core Insight:</p>
            <p className="text-gray-700">We don't prove infinity directly. Instead, we show that <em>assuming finitely many primes leads to a contradiction</em>.</p>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-yellow-50">
            <p className="mb-2 font-semibold">The Strategy:</p>
            <ol className="ml-6 space-y-2 list-decimal">
              <li>Assume there are only finitely many primes</li>
              <li>List them all: p₁, p₂, p₃, ..., pₙ</li>
              <li>Construct a special number from these primes</li>
              <li>Show this number creates an impossible situation</li>
              <li>Conclude there must be infinitely many primes</li>
            </ol>
          </div>

          <p className="mt-4 italic text-gray-700">This is proof by contradiction at its finest.</p>
        </div>
      ),
      question: "Why do we use proof by contradiction for this theorem?",
      options: [
        { text: "Because we can't list all infinite primes directly", correct: true, explanation: "Exactly! We can't demonstrate infinity by listing. Contradiction lets us prove it indirectly." },
        { text: "Because primes are too complicated", correct: false, explanation: "Primes are simple. Contradiction is just the right tool for proving 'infinitely many' exists." },
        { text: "It's the only way to prove anything about primes", correct: false, explanation: "Many prime theorems use direct proof. Contradiction is just perfect for this one." }
      ],
      hint: "Think about why we can't just 'show' infinitely many of anything directly"
    },
    {
      id: 1,
      title: "The Setup: Assuming Finitely Many Primes",
      content: (
        <div className="space-y-4">
          <p className="text-lg"><strong>Assumption (for contradiction):</strong> Suppose there are finitely many primes.</p>
          
          <div className="p-6 rounded-lg bg-blue-50">
            <p className="mb-3">Then we can list <em>all</em> of them:</p>
            <div className="my-4 font-mono text-xl text-center">
              p₁, p₂, p₃, ..., pₙ
            </div>
            <p className="text-sm text-gray-600">Where n is some fixed number, and these are <strong>all the primes that exist</strong>.</p>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-green-50">
            <p className="mb-2 font-semibold">Example with small primes:</p>
            <p>If we pretended only (2, 3, 5, 7) existed, then:</p>
            <p className="my-2 font-mono text-center">p₁ = 2, p₂ = 3, p₃ = 5, p₄ = 7</p>
            <p className="text-sm text-gray-600">We'll use this example to build intuition!</p>
          </div>

          <p className="mt-4 text-gray-700">The key: once we list them all, we can work with <em>all of them at once</em>.</p>
        </div>
      ),
      question: "If our assumption is correct, what can we say about the list p₁, p₂, ..., pₙ?",
      options: [
        { text: "It contains some of the primes", correct: false, explanation: "No! The assumption is that this list contains ALL primes, every single one." },
        { text: "It contains ALL primes that exist", correct: true, explanation: "Correct! That's our assumption - this finite list is complete, there are no other primes." },
        { text: "It's impossible to create such a list", correct: false, explanation: "We're assuming we CAN create it. That's what we'll prove wrong!" }
      ],
      hint: "Remember: we're assuming finitely many exist, so we CAN list them all"
    },
    {
      id: 2,
      title: "The Magic Number: Constructing N",
      content: (
        <div className="space-y-4">
          <p className="text-lg">Now for Euclid's brilliant move. We construct a special number:</p>
          
          <div className="p-6 border-2 border-purple-300 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
            <p className="my-4 text-2xl font-bold text-center">
              N = (p₁ × p₂ × p₃ × ... × pₙ) + 1
            </p>
            <p className="text-center text-gray-600">Product of ALL primes, plus one</p>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-blue-50">
            <p className="mb-2 font-semibold">With our example (2, 3, 5, 7):</p>
            <p className="font-mono">N = (2 × 3 × 5 × 7) + 1</p>
            <p className="font-mono">N = 210 + 1</p>
            <p className="font-mono text-lg">N = 211</p>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-yellow-50">
            <p className="mb-2 font-semibold">Why this number?</p>
            <p className="text-gray-700">This N has a magical property: when you divide N by any prime in our list, you get remainder 1.</p>
            <p className="mt-2 text-sm text-gray-600">For example: 211 ÷ 2 = 105 remainder 1, 211 ÷ 3 = 70 remainder 1, etc.</p>
          </div>
        </div>
      ),
      question: "What happens when you divide N by any prime pᵢ from our list?",
      options: [
        { text: "You get remainder 0 (it divides evenly)", correct: false, explanation: "No! N = (product of all primes) + 1, so dividing by any prime leaves remainder 1." },
        { text: "You get remainder 1", correct: true, explanation: "Yes! Since N = (p₁×p₂×...×pₙ) + 1, dividing by any pᵢ gives remainder 1." },
        { text: "It depends on which prime", correct: false, explanation: "Actually, it's the same for ALL primes in our list - always remainder 1!" }
      ],
      hint: "If N = 'multiple of pᵢ' + 1, what's the remainder when dividing N by pᵢ?"
    },
    {
      id: 3,
      title: "The Key Insight: N Must Have a Prime Divisor",
      content: (
        <div className="space-y-4">
          <p className="text-lg">Now we examine our number N more carefully.</p>
          
          <div className="p-6 border-2 border-green-300 rounded-lg bg-green-50">
            <p className="mb-3 text-lg font-semibold">Fundamental Theorem of Arithmetic:</p>
            <p>Every integer greater than 1 is either:</p>
            <ul className="mt-2 ml-6 space-y-1 list-disc">
              <li>Prime itself, OR</li>
              <li>Divisible by at least one prime number</li>
            </ul>
          </div>

          <p className="mt-4">Since N = (p₁ × p₂ × ... × pₙ) + 1, and this product is at least 2, we know <strong>N ≥ 3</strong>.</p>

          <div className="p-4 mt-4 rounded-lg bg-blue-50">
            <p className="mb-2 font-semibold">Two possibilities for N:</p>
            <div className="mt-3 space-y-3">
              <div className="pl-4 border-l-4 border-blue-400">
                <p className="font-semibold">Case 1: N is prime</p>
                <p className="text-sm text-gray-600">Then N itself is a prime not in our list!</p>
              </div>
              <div className="pl-4 border-l-4 border-purple-400">
                <p className="font-semibold">Case 2: N is composite</p>
                <p className="text-sm text-gray-600">Then N has a prime divisor - but which one?</p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-gray-700">In our example: N = 211. Is 211 prime or composite? (It's actually prime!)</p>
        </div>
      ),
      question: "Why must N have at least one prime divisor (or be prime itself)?",
      options: [
        { text: "Because N is constructed from primes", correct: false, explanation: "That's not the reason. It's because EVERY integer > 1 has a prime divisor." },
        { text: "By the Fundamental Theorem of Arithmetic", correct: true, explanation: "Exactly! Every integer > 1 is either prime or has a prime divisor. This is foundational." },
        { text: "Because we added 1 to the product", correct: false, explanation: "Adding 1 doesn't guarantee prime divisors - the Fundamental Theorem does!" }
      ],
      hint: "This is a fundamental property of ALL integers greater than 1"
    },
    {
      id: 4,
      title: "The Trap Springs: Case 1 (N is Prime)",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-semibold">Case 1: Suppose N is prime</p>
          
          <div className="p-6 border-2 border-red-300 rounded-lg bg-gradient-to-r from-red-50 to-orange-50">
            <p className="mb-3 text-lg">If N is prime, then:</p>
            <ul className="space-y-2">
              <li>✓ N is a prime number</li>
              <li>✓ N = (p₁ × p₂ × ... × pₙ) + 1, which is larger than any pᵢ</li>
              <li>✗ But we assumed p₁, p₂, ..., pₙ were ALL the primes!</li>
            </ul>
            <p className="mt-4 font-semibold text-red-700">Contradiction! We found a new prime not in our "complete" list.</p>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-blue-50">
            <p className="mb-2 font-semibold">In our example:</p>
            <p>N = 211, and 211 is indeed prime.</p>
            <p className="mt-2">But we assumed (2, 3, 5, 7) were all the primes.</p>
            <p className="mt-2 font-semibold text-red-600">211 is a prime we missed!</p>
          </div>

          <p className="mt-4 italic text-gray-700">This shows our assumption must be wrong when N is prime. But what if N is composite?</p>
        </div>
      ),
      question: "If N is prime, why is this a contradiction?",
      options: [
        { text: "Because N is too large", correct: false, explanation: "Size isn't the issue - the issue is N is a prime not in our supposedly complete list." },
        { text: "Because N wasn't in our original list of ALL primes", correct: true, explanation: "Exactly! We found a prime (N) that's not in our 'complete' list. That's impossible!" },
        { text: "Because primes can't be constructed this way", correct: false, explanation: "Actually, we CAN construct primes this way - that's the point!" }
      ],
      hint: "What did we assume about our list p₁, p₂, ..., pₙ?"
    },
    {
      id: 5,
      title: "The Trap Springs: Case 2 (N is Composite)",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-semibold">Case 2: Suppose N is composite</p>
          
          <div className="p-6 border-2 border-purple-300 rounded-lg bg-purple-50">
            <p className="mb-3">If N is composite, then N must have a prime divisor. Call it <strong>q</strong>.</p>
            <p className="mt-3">Now, where did q come from?</p>
            <ul className="mt-3 ml-6 space-y-2 list-disc">
              <li><strong>Option A:</strong> q is one of our listed primes (q = pᵢ for some i)</li>
              <li><strong>Option B:</strong> q is a new prime not in our list</li>
            </ul>
          </div>

          <div className="p-6 mt-4 border-2 border-red-300 rounded-lg bg-gradient-to-r from-red-50 to-orange-50">
            <p className="mb-2 text-lg font-semibold">Option A leads to contradiction:</p>
            <p>If q = pᵢ (one of our listed primes), then:</p>
            <ul className="mt-2 ml-6 space-y-1 list-disc">
              <li>q divides N (because q is a prime divisor of N)</li>
              <li>q divides (p₁ × p₂ × ... × pₙ) (because q is in the product)</li>
              <li>But N = (p₁ × p₂ × ... × pₙ) + 1</li>
              <li>So q divides both N and (N - 1)</li>
              <li>Therefore q divides N - (N-1) = 1</li>
              <li><strong>Impossible!</strong> No prime divides 1.</li>
            </ul>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-blue-50">
            <p className="mb-2 font-semibold">Option B also leads to contradiction:</p>
            <p>If q is a new prime not in our list, then we found another prime beyond p₁, p₂, ..., pₙ.</p>
            <p className="mt-2 font-semibold text-red-600">But we assumed those were ALL the primes!</p>
          </div>
        </div>
      ),
      question: "If a prime q divides N, can q be one of the primes p₁, p₂, ..., pₙ from our list?",
      options: [
        { text: "Yes, it must be one of them", correct: false, explanation: "No! If q were in the list, it would divide both N and the product, making it divide 1. Impossible!" },
        { text: "No, because that leads to q dividing 1", correct: true, explanation: "Exactly! If q is in the list, the math forces q to divide 1, which is impossible for any prime." },
        { text: "It depends on which prime", correct: false, explanation: "The logic applies to ANY prime in the list - none of them can divide N!" }
      ],
      hint: "If q divides both N and (N-1), what must q divide?"
    },
    {
      id: 6,
      title: "The Beautiful Conclusion",
      content: (
        <div className="space-y-4">
          <div className="p-6 border-2 border-green-400 rounded-lg bg-gradient-to-r from-green-50 to-teal-50">
            <p className="mb-4 text-xl font-bold">Summary of the Proof:</p>
            <ol className="ml-6 space-y-3 list-decimal">
              <li><strong>Assume</strong> there are finitely many primes: p₁, p₂, ..., pₙ</li>
              <li><strong>Construct</strong> N = (p₁ × p₂ × ... × pₙ) + 1</li>
              <li><strong>Observe</strong> N &gt; 1, so N is either prime or has a prime divisor</li>
              <li><strong>Case 1:</strong> If N is prime → N is a new prime not in our list → Contradiction</li>
              <li><strong>Case 2:</strong> If N is composite with prime divisor q:
                <ul className="mt-1 ml-6 list-disc">
                  <li>If q is in our list → q divides 1 → Impossible</li>
                  <li>If q is not in our list → New prime → Contradiction</li>
                </ul>
              </li>
              <li><strong>Conclusion:</strong> Our assumption was wrong. There are infinitely many primes! ∎</li>
            </ol>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-yellow-50">
            <p className="flex items-center gap-2 mb-2 font-semibold">
              <Sparkles className="w-5 h-5 text-yellow-600" />
              Why This Proof is Brilliant:
            </p>
            <ul className="ml-6 space-y-1 text-gray-700 list-disc">
              <li>It's constructive: given any finite list, we build a number showing it's incomplete</li>
              <li>It's elementary: uses only basic arithmetic and logic</li>
              <li>It's ancient: over 2300 years old and still perfect</li>
              <li>It's airtight: covers all possibilities exhaustively</li>
            </ul>
          </div>
        </div>
      ),
      question: "What makes this proof work?",
      options: [
        { text: "We explicitly construct infinitely many primes", correct: false, explanation: "No! We never construct infinite primes. We show finite lists always miss at least one." },
        { text: "We show any finite list of primes is incomplete", correct: true, explanation: "Perfect! We show that from ANY finite list, we can find or construct a prime not on it." },
        { text: "We calculate all the primes", correct: false, explanation: "We don't calculate them all - that's impossible! We prove no finite list can be complete." }
      ],
      hint: "We don't prove infinity directly - we prove finiteness is impossible"
    },
    {
      id: 7,
      title: "Interactive: Build Your Own Proof",
      interactive: true,
      content: (state, setState) => {
        const primes = state.primes || [2, 3, 5];
        const product = primes.reduce((a, b) => a * b, 1);
        const n = product + 1;

        return (
          <div className="space-y-4">
            <p className="text-lg">Let's construct Euclid's number with your own prime list!</p>
            
            <div className="p-4 rounded-lg bg-blue-50">
              <p className="mb-2 font-semibold">Your prime list:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {primes.map((p, idx) => (
                  <span key={idx} className="px-3 py-1 font-mono bg-blue-200 rounded-full">
                    {p}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const nextPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23];
                    const next = nextPrimes.find(p => !primes.includes(p));
                    if (next) setState({ primes: [...primes, next] });
                  }}
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Add Next Prime
                </button>
                <button
                  onClick={() => setState({ primes: [2, 3, 5] })}
                  className="px-4 py-2 text-gray-700 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="p-6 border-2 border-purple-300 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
              <p className="mb-3 font-semibold">Euclid's Construction:</p>
              <div className="space-y-2 font-mono text-center">
                <p>Product = {primes.join(' × ')} = {product}</p>
                <p className="text-xl font-bold text-purple-700">N = {product} + 1 = {n}</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-green-50">
              <p className="mb-2 font-semibold">Analysis of N = {n}:</p>
              <div className="space-y-2">
                {primes.map(p => (
                  <p key={p} className="text-sm">
                    {n} ÷ {p} = {Math.floor(n / p)} remainder <span className="font-bold text-green-700">{n % p}</span>
                  </p>
                ))}
              </div>
              <p className="mt-3 font-semibold text-green-700">
                None of your primes divide N evenly!
              </p>
            </div>

            <div className="p-4 rounded-lg bg-yellow-50">
              <p className="text-sm text-gray-700">
                {n > 100 ? 
                  `${n} is either prime itself, or divisible by a prime not in your list. Either way, your list is incomplete!` :
                  `Try adding more primes to see how N grows!`
                }
              </p>
            </div>
          </div>
        );
      },
      question: "What does this interactive demo show?",
      options: [
        { text: "That we can list all primes", correct: false, explanation: "No! It shows the opposite - any list we make is incomplete." },
        { text: "That any finite list of primes can be extended", correct: true, explanation: "Yes! No matter what primes we list, N shows the list is incomplete." },
        { text: "That Euclid's number is always prime", correct: false, explanation: "N isn't always prime (e.g., for (2,3,5,7,11,13), N=30031=59×509), but it always reveals a missing prime!" }
      ],
      hint: "Try adding more primes and see what happens to N"
    },
    {
      id: 8,
      title: "Common Misconceptions",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-semibold">Let's clear up some misunderstandings:</p>

          <div className="p-4 border-l-4 border-red-400 rounded-lg bg-red-50">
            <p className="mb-2 font-semibold text-red-700">❌ Misconception 1:</p>
            <p className="mb-2">"N = (p₁ × ... × pₙ) + 1 is always prime"</p>
            <p className="text-sm text-gray-700"><strong>Truth:</strong> N is not always prime! For example, (2×3×5×7×11×13)+1 = 30031 = 59×509. But N always reveals a prime not in the list.</p>
          </div>

          <div className="p-4 border-l-4 border-red-400 rounded-lg bg-red-50">
            <p className="mb-2 font-semibold text-red-700">❌ Misconception 2:</p>
            <p className="mb-2">"This proof gives us a method to find all primes"</p>
            <p className="text-sm text-gray-700"><strong>Truth:</strong> This proves infinitely many exist, but doesn't efficiently generate them. It's an existence proof, not an algorithm.</p>
          </div>

          <div className="p-4 border-l-4 border-red-400 rounded-lg bg-red-50">
            <p className="mb-2 font-semibold text-red-700">❌ Misconception 3:</p>
            <p className="mb-2">"We prove there are infinitely many by showing infinite examples"</p>
            <p className="text-sm text-gray-700"><strong>Truth:</strong> We prove it by contradiction - showing that assuming finitely many leads to impossibility. We never enumerate infinite primes.</p>
          </div>

          <div className="p-4 mt-4 border-l-4 border-green-400 rounded-lg bg-green-50">
            <p className="mb-2 font-semibold text-green-700">✓ What the proof actually shows:</p>
            <p className="text-sm text-gray-700">Given ANY finite collection of primes, we can find a number that either IS prime (not in the collection) or HAS a prime divisor (not in the collection). Thus, no finite collection can be complete.</p>
          </div>
        </div>
      ),
      question: "Is (2 × 3 × 5 × 7 × 11 × 13) + 1 = 30031 prime?",
      options: [
        { text: "Yes, N is always prime", correct: false, explanation: "No! 30031 = 59 × 509. N isn't always prime, but it always exposes a missing prime." },
        { text: "No, it's composite (30031 = 59 × 509)", correct: true, explanation: "Correct! N can be composite. But 59 and 509 are primes not in the list (2,3,5,7,11,13)!" },
        { text: "It doesn't matter if it's prime or not", correct: false, explanation: "It matters for the proof logic, though either case gives us a contradiction." }
      ],
      hint: "The proof works whether N is prime OR composite!"
    },
    {
      id: 9,
      title: "Master Challenge: Prove It Yourself",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-semibold">Final Test: Can you identify the correct proof structure?</p>
          
          <div className="p-6 border-2 border-purple-300 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
            <p className="mb-3 font-semibold">The complete proof structure:</p>
            <ol className="ml-6 space-y-2 text-sm list-decimal">
              <li>Assume finitely many primes exist</li>
              <li>List them: p₁, p₂, ..., pₙ</li>
              <li>Construct N = (p₁ × p₂ × ... × pₙ) + 1</li>
              <li>N must be prime or composite (by Fundamental Theorem)</li>
              <li>If prime: N is a new prime (contradiction)</li>
              <li>If composite: N has a prime divisor q not in the list (contradiction)</li>
              <li>Therefore: infinitely many primes exist</li>
            </ol>
          </div>

          <div className="p-4 mt-4 rounded-lg bg-yellow-50">
            <p className="mb-2 font-semibold">Key Skills Mastered:</p>
            <ul className="ml-6 space-y-1 text-sm list-disc">
              <li>Proof by contradiction technique</li>
              <li>Understanding why finite assumptions fail</li>
              <li>Using the Fundamental Theorem of Arithmetic</li>
              <li>Case-by-case exhaustive analysis</li>
              <li>Recognizing existence proofs vs. constructive algorithms</li>
            </ul>
          </div>
        </div>
      ),
      question: "You now understand Euclid's proof. What's the MOST important insight?",
      options: [
        { text: "We can generate new primes by multiplying known primes and adding 1", correct: false, explanation: "Not quite - N isn't always prime. The insight is that N reveals our list is incomplete." },
        { text: "Any finite list of primes can be shown to be incomplete", correct: true, explanation: "Perfect! This is the heart of it - no matter what finite list we propose, we can prove it's missing something." },
        { text: "Primes follow a predictable pattern", correct: false, explanation: "Actually, primes are famously unpredictable! This proof doesn't give us a pattern." }
      ],
      hint: "Think about what the proof accomplishes, not what N specifically is"
    }
  ];

  const handleAnswer = (levelId, optionIndex) => {
    const level = levels[levelId];
    
    if (level.multiSelect) {
      const current = userAnswers[levelId] || [];
      const newAnswers = current.includes(optionIndex)
        ? current.filter(i => i !== optionIndex)
        : [...current, optionIndex];
      setUserAnswers({ ...userAnswers, [levelId]: newAnswers });
    } else {
      setUserAnswers({ ...userAnswers, [levelId]: [optionIndex] });
    }
  };

  const checkAnswer = (levelId) => {
    const level = levels[levelId];
    const selected = userAnswers[levelId] || [];
    const correctIndices = level.options
      .map((opt, idx) => opt.correct ? idx : -1)
      .filter(idx => idx !== -1);
    
    const isCorrect = selected.length === correctIndices.length &&
      selected.every(idx => correctIndices.includes(idx));
    
    if (isCorrect && !completedLevels.includes(levelId)) {
      setCompletedLevels([...completedLevels, levelId]);
    }
    
    return isCorrect;
  };

  const currentLevelData = levels[currentLevel];
  const selected = userAnswers[currentLevel] || [];
  const hasAnswered = selected.length > 0;
  const isCorrect = hasAnswered && checkAnswer(currentLevel);
  const canProceed = completedLevels.includes(currentLevel) || isCorrect;

  return (
    <div className="max-w-4xl min-h-screen p-6 mx-auto bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-lg">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Mastering the Infinite Primes Proof
          </h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 transition-all duration-500 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ width: `${((currentLevel + 1) / levels.length) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-600">
              {currentLevel + 1}/{levels.length}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-purple-600">
              LEVEL {currentLevel + 1}
            </span>
            {completedLevels.includes(currentLevel) && (
              <Award className="w-5 h-5 text-yellow-500" />
            )}
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            {currentLevelData.title}
          </h2>
          
          <div className="mb-6 prose max-w-none">
            {currentLevelData.interactive ? 
              currentLevelData.content(interactiveState, setInteractiveState) : 
              currentLevelData.content
            }
          </div>
        </div>

        <div className="p-6 mb-6 rounded-lg bg-gray-50">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            {currentLevelData.question}
          </h3>
          
          <div className="space-y-3">
            {currentLevelData.options.map((option, idx) => {
              const isSelected = selected.includes(idx);
              const showResult = hasAnswered;
              
              return (
                <div key={idx}>
                  <button
                    onClick={() => handleAnswer(currentLevel, idx)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? showResult && option.correct
                          ? 'border-green-500 bg-green-50'
                          : showResult && !option.correct
                          ? 'border-red-500 bg-red-50'
                          : 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.text}</span>
                      {showResult && isSelected && (
                        option.correct ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )
                      )}
                    </div>
                  </button>
                  {showResult && isSelected && (
                    <p className={`mt-2 text-sm ml-4 ${
                      option.correct ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {option.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {currentLevelData.hint && (
            <div className="mt-4">
              <button
                onClick={() => setShowHints({ ...showHints, [currentLevel]: !showHints[currentLevel] })}
                className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700"
              >
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {showHints[currentLevel] ? 'Hide' : 'Show'} Hint
                </span>
              </button>
              {showHints[currentLevel] && (
                <p className="p-3 mt-2 text-sm text-gray-600 rounded bg-yellow-50">
                  {currentLevelData.hint}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentLevel(Math.max(0, currentLevel - 1))}
            disabled={currentLevel === 0}
            className="px-6 py-2 text-gray-700 transition-colors bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400"
          >
            Previous
          </button>
          
          {currentLevel === levels.length - 1 ? (
            <div className="flex items-center gap-2">
              {completedLevels.length === levels.length && (
                <div className="flex items-center gap-2 font-semibold text-green-600">
                  <Award className="w-6 h-6" />
                  <span>Master Complete!</span>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setCurrentLevel(Math.min(levels.length - 1, currentLevel + 1))}
              disabled={!canProceed}
              className="flex items-center gap-2 px-6 py-2 text-white transition-all rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-600"
            >
              <span>Next Level</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {completedLevels.length === levels.length && (
          <div className="p-6 mt-6 border-2 border-green-300 rounded-lg bg-gradient-to-r from-green-50 to-blue-50">
            <h3 className="flex items-center gap-2 mb-2 text-xl font-bold text-gray-800">
              <Award className="w-6 h-6 text-yellow-500" />
              Congratulations, Proof Master!
            </h3>
            <p className="mb-3 text-gray-700">
              You've mastered Euclid's proof that there are infinitely many primes. You now understand:
            </p>
            <ul className="ml-6 space-y-1 text-gray-700 list-disc">
              <li>How proof by contradiction works in practice</li>
              <li>Why the construction N = (p₁ × p₂ × ... × pₙ) + 1 is brilliant</li>
              <li>How to handle multiple cases exhaustively</li>
              <li>The difference between existence proofs and algorithms</li>
              <li>One of the most elegant arguments in all of mathematics</li>
            </ul>
            <p className="mt-4 italic text-gray-700">
              This 2300-year-old proof remains a masterpiece of mathematical reasoning!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfinitePrimesProof;