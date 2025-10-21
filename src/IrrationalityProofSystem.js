import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, ArrowRight, Award } from 'lucide-react';

const IrrationalityProofSystem = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showHints, setShowHints] = useState({});
  const [completedLevels, setCompletedLevels] = useState([]);

  const levels = [
    {
      id: 0,
      title: "Foundation: Understanding Rational Numbers",
      content: (
        <div className="space-y-4">
          <p className="text-lg">A <strong>rational number</strong> is any number that can be expressed as a fraction p/q where:</p>
          <ul className="ml-6 space-y-2 list-disc">
            <li>p and q are integers</li>
            <li>q ≠ 0</li>
            <li>p and q have no common factors (the fraction is in <strong>lowest terms</strong>)</li>
          </ul>
          <div className="p-4 rounded-lg bg-blue-50">
            <p className="mb-2 font-semibold">Examples:</p>
            <p>• 1/2 is rational (p=1, q=2)</p>
            <p>• 3 is rational (p=3, q=1)</p>
            <p>• 0.75 is rational (p=3, q=4)</p>
          </div>
        </div>
      ),
      question: "Which of these can be expressed as a fraction in lowest terms?",
      options: [
        { text: "0.333... (repeating)", correct: true, explanation: "Yes! This equals 1/3" },
        { text: "π", correct: false, explanation: "No, π is irrational - it cannot be expressed as a fraction" },
        { text: "-7", correct: true, explanation: "Yes! This equals -7/1" },
        { text: "0.5", correct: true, explanation: "Yes! This equals 1/2" }
      ],
      multiSelect: true,
      hint: "Remember: if a decimal terminates or repeats, it's rational!"
    },
    {
      id: 1,
      title: "Key Concept: Even and Odd Numbers",
      content: (
        <div className="space-y-4">
          <p className="text-lg">Understanding even and odd numbers is crucial for the √2 proof:</p>
          <div className="p-4 space-y-3 rounded-lg bg-green-50">
            <p><strong>Even number:</strong> Can be written as 2k for some integer k</p>
            <p><strong>Odd number:</strong> Can be written as 2k+1 for some integer k</p>
          </div>
          <div className="p-4 mt-4 rounded-lg bg-yellow-50">
            <p className="mb-2 font-semibold">Critical Property:</p>
            <p>If n² is even, then n must be even.</p>
            <p className="mt-2 text-sm text-gray-600">Proof: If n were odd (n=2k+1), then n²=4k²+4k+1=2(2k²+2k)+1, which is odd. Contradiction!</p>
          </div>
        </div>
      ),
      question: "If n² = 36, and we know 36 is even, what can we conclude about n?",
      options: [
        { text: "n must be even", correct: true, explanation: "Correct! Since 36=n² is even, n must be even (n=6)" },
        { text: "n could be odd", correct: false, explanation: "No! If n² is even, n cannot be odd" },
        { text: "n could be any integer", correct: false, explanation: "No! The evenness of n² tells us about n" }
      ],
      hint: "Use the property: if n² is even, then n is even"
    },
    {
      id: 2,
      title: "Proof Technique: Contradiction",
      content: (
        <div className="space-y-4">
          <p className="text-lg">We'll use <strong>proof by contradiction</strong>:</p>
          <div className="p-4 space-y-3 rounded-lg bg-purple-50">
            <p><strong>Step 1:</strong> Assume the opposite of what you want to prove</p>
            <p><strong>Step 2:</strong> Follow logical steps from this assumption</p>
            <p><strong>Step 3:</strong> Reach a contradiction (something impossible)</p>
            <p><strong>Step 4:</strong> Conclude the original assumption was false</p>
          </div>
          <div className="p-4 mt-4 rounded-lg bg-blue-50">
            <p className="font-semibold">Example: Prove there's no largest integer</p>
            <p className="mt-2 text-sm">Assume n is the largest integer. Then n+1 is also an integer, and n+1 > n. Contradiction! So no largest integer exists.</p>
          </div>
        </div>
      ),
      question: "To prove √2 is irrational, what should we assume at the start?",
      options: [
        { text: "Assume √2 is irrational", correct: false, explanation: "No, we assume the opposite!" },
        { text: "Assume √2 is rational", correct: true, explanation: "Correct! We assume √2 = p/q in lowest terms, then find a contradiction" },
        { text: "Assume √2 is an integer", correct: false, explanation: "Too specific - we assume it's rational (p/q)" }
      ],
      hint: "In proof by contradiction, assume the OPPOSITE of what you're trying to prove"
    },
    {
      id: 3,
      title: "The √2 Proof - Part 1: The Setup",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-semibold">Theorem: √2 is irrational</p>
          <div className="p-4 space-y-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <p><strong>Assume (for contradiction):</strong> √2 is rational</p>
            <p>Then √2 = p/q where p, q are integers with no common factors (lowest terms)</p>
            <p className="mt-3"><strong>Square both sides:</strong></p>
            <p className="my-2 text-xl text-center">2 = p²/q²</p>
            <p><strong>Multiply both sides by q²:</strong></p>
            <p className="my-2 text-xl text-center">2q² = p²</p>
          </div>
          <p className="text-gray-700">This tells us p² is even (it equals 2q²). What does this mean about p?</p>
        </div>
      ),
      question: "Since p² = 2q² (so p² is even), what can we conclude?",
      options: [
        { text: "p must be even", correct: true, explanation: "Correct! If p² is even, then p must be even" },
        { text: "p must be odd", correct: false, explanation: "No! Even² = even, but odd² = odd" },
        { text: "We can't determine anything about p", correct: false, explanation: "We can! Use the even/odd property" }
      ],
      hint: "Remember the property from Level 1: if n² is even, then n is even"
    },
    {
      id: 4,
      title: "The √2 Proof - Part 2: The Trap Closes",
      content: (
        <div className="space-y-4">
          <p>We established that <strong>p must be even</strong>, so we can write p = 2m for some integer m.</p>
          <div className="p-4 space-y-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
            <p><strong>Substitute p = 2m into p² = 2q²:</strong></p>
            <p className="my-2 text-lg text-center">(2m)² = 2q²</p>
            <p className="my-2 text-lg text-center">4m² = 2q²</p>
            <p><strong>Divide both sides by 2:</strong></p>
            <p className="my-2 text-lg text-center">2m² = q²</p>
          </div>
          <p className="text-gray-700">Now we see that q² is even (it equals 2m²). What does this tell us about q?</p>
        </div>
      ),
      question: "Since q² = 2m² (so q² is even), what can we conclude?",
      options: [
        { text: "q must be even", correct: true, explanation: "Correct! If q² is even, then q must be even" },
        { text: "q must be odd", correct: false, explanation: "No! We use the same logic as with p" },
        { text: "This doesn't matter", correct: false, explanation: "This is crucial - it creates our contradiction!" }
      ],
      hint: "Apply the same reasoning we used for p"
    },
    {
      id: 5,
      title: "The √2 Proof - Part 3: The Contradiction",
      content: (
        <div className="space-y-4">
          <div className="p-4 border-2 border-red-300 rounded-lg bg-red-50">
            <p className="mb-2 text-lg font-semibold text-red-800">The Contradiction:</p>
            <p>We've proven that:</p>
            <ul className="my-2 ml-6 list-disc">
              <li><strong>p is even</strong> (divisible by 2)</li>
              <li><strong>q is even</strong> (divisible by 2)</li>
            </ul>
            <p className="mt-3">But we assumed p/q was in <strong>lowest terms</strong> (no common factors)!</p>
            <p className="mt-2">If both p and q are even, they share a common factor of 2. This contradicts our assumption!</p>
          </div>
          <div className="p-4 mt-4 rounded-lg bg-green-50">
            <p className="font-semibold text-green-800">Conclusion:</p>
            <p>Our assumption that √2 is rational must be FALSE.</p>
            <p className="mt-2">Therefore, <strong>√2 is irrational</strong>. ∎</p>
          </div>
        </div>
      ),
      question: "What was the key contradiction in this proof?",
      options: [
        { text: "p/q was supposed to be in lowest terms, but both p and q are even", correct: true, explanation: "Exactly! This is the contradiction that proves √2 is irrational" },
        { text: "√2 cannot be squared", correct: false, explanation: "We can square √2 to get 2" },
        { text: "Even numbers cannot be rational", correct: false, explanation: "Even numbers can definitely be rational" }
      ],
      hint: "What did we assume about p/q at the beginning?"
    },
    {
      id: 6,
      title: "Generalization: Proving √3 is Irrational",
      content: (
        <div className="space-y-4">
          <p className="text-lg">Let's apply the same technique to √3:</p>
          <div className="p-4 space-y-2 rounded-lg bg-blue-50">
            <p><strong>Assume:</strong> √3 = p/q (lowest terms)</p>
            <p><strong>Square:</strong> 3 = p²/q²</p>
            <p><strong>Rearrange:</strong> 3q² = p²</p>
            <p className="mt-3">This means p² is divisible by 3.</p>
            <p className="text-sm text-gray-700">Key fact: If p² is divisible by 3, then p is divisible by 3</p>
          </div>
          <p>So p = 3m for some integer m...</p>
        </div>
      ),
      question: "Following the pattern, what happens when we substitute p = 3m into 3q² = p²?",
      options: [
        { text: "We get 3q² = 9m², so q² = 3m², showing q is also divisible by 3", correct: true, explanation: "Perfect! Same contradiction: both p and q divisible by 3" },
        { text: "We get a different result than with √2", correct: false, explanation: "The logic is identical, just with 3 instead of 2" },
        { text: "We cannot proceed further", correct: false, explanation: "We can! Follow the same steps as with √2" }
      ],
      hint: "Substitute p = 3m into 3q² = p² and simplify"
    },
    {
      id: 7,
      title: "Master Level: Proving √6 is Irrational",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-semibold">Your challenge: Prove √6 is irrational</p>
          <div className="p-4 rounded-lg bg-yellow-50">
            <p className="mb-2"><strong>Template to follow:</strong></p>
            <ol className="ml-6 space-y-1 list-decimal">
              <li>Assume √6 = p/q (lowest terms)</li>
              <li>Square both sides and rearrange</li>
              <li>Show p must be divisible by a certain number</li>
              <li>Show q must also be divisible by that number</li>
              <li>Find the contradiction</li>
            </ol>
          </div>
        </div>
      ),
      question: "After assuming √6 = p/q and squaring, we get 6q² = p². What can we conclude?",
      options: [
        { text: "p² is divisible by 6, so p is divisible by 6", correct: false, explanation: "Close, but not quite! 6 = 2×3, so we need to think about 2 and 3 separately" },
        { text: "p² is even (divisible by 2), so p is even", correct: true, explanation: "Correct! Since 6q² = p², p² is even, so p is even" },
        { text: "We cannot determine anything", correct: false, explanation: "We can! Look at what 6q² = p² tells us" }
      ],
      hint: "6q² = p² means p² = 2(3q²), so p² is even"
    },
    {
      id: 8,
      title: "Advanced Technique: √(prime) is Always Irrational",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-semibold">General Theorem:</p>
          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
            <p className="text-lg">If p is prime, then √p is irrational</p>
          </div>
          <p className="mt-4"><strong>Why?</strong> The proof follows the same pattern:</p>
          <ul className="ml-6 space-y-2 list-disc">
            <li>Assume √p = a/b (lowest terms)</li>
            <li>Then p = a²/b², so pb² = a²</li>
            <li>Therefore a² is divisible by p</li>
            <li>Since p is prime: if p divides a², then p divides a</li>
            <li>So a = pk, giving pb² = p²k², thus b² = pk²</li>
            <li>So b² is divisible by p, meaning b is divisible by p</li>
            <li>Contradiction: both a and b divisible by p!</li>
          </ul>
        </div>
      ),
      question: "Which of these square roots are irrational by this theorem?",
      options: [
        { text: "√2", correct: true, explanation: "Yes! 2 is prime" },
        { text: "√4", correct: false, explanation: "No! √4 = 2, which is rational. Also 4 is not prime" },
        { text: "√7", correct: true, explanation: "Yes! 7 is prime" },
        { text: "√9", correct: false, explanation: "No! √9 = 3, which is rational. Also 9 is not prime" }
      ],
      multiSelect: true,
      hint: "Which numbers are prime? Remember √4 = 2 and √9 = 3"
    },
    {
      id: 9,
      title: "Final Boss: When is √n Irrational?",
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-teal-50">
            <p className="mb-3 text-lg font-semibold">Complete Characterization:</p>
            <p><strong>√n is rational</strong> if and only if <strong>n is a perfect square</strong> (n = k² for some integer k)</p>
          </div>
          <p className="mt-4"><strong>Examples:</strong></p>
          <ul className="ml-6 space-y-2 list-disc">
            <li>√16 is rational (16 = 4²)</li>
            <li>√15 is irrational (15 is not a perfect square)</li>
            <li>√50 is irrational (50 = 25×2, not a perfect square)</li>
          </ul>
          <div className="p-4 mt-4 rounded-lg bg-yellow-50">
            <p className="font-semibold">Pro tip:</p>
            <p>To prove √n is irrational when n is not a perfect square, factor n into primes. If any prime appears an odd number of times, √n is irrational!</p>
          </div>
        </div>
      ),
      question: "Which of these are irrational?",
      options: [
        { text: "√12", correct: true, explanation: "Yes! 12 = 2²×3, and 3 appears once (odd), so √12 is irrational" },
        { text: "√36", correct: false, explanation: "No! √36 = 6, a perfect square" },
        { text: "√18", correct: true, explanation: "Yes! 18 = 2×3², and 2 appears once (odd), so √18 is irrational" },
        { text: "√49", correct: false, explanation: "No! √49 = 7, a perfect square" }
      ],
      multiSelect: true,
      hint: "Check if each number is a perfect square, or factor into primes"
    }
  ];

  const handleAnswer = (levelId, optionIndex) => {
    const level = levels[levelId];
    const option = level.options[optionIndex];
    
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
            Mastering Irrationality Proofs
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
            {currentLevelData.content}
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
              Congratulations, Master of Irrationality!
            </h3>
            <p className="text-gray-700">
              You've mastered the proof that √2 is irrational and can now prove whether any number is rational or irrational. Key techniques you've learned:
            </p>
            <ul className="mt-2 ml-6 text-gray-700 list-disc">
              <li>Proof by contradiction</li>
              <li>Using the lowest terms assumption</li>
              <li>Properties of even/odd and divisibility</li>
              <li>Generalization to any √prime</li>
              <li>The perfect square test for √n</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default IrrationalityProofSystem;